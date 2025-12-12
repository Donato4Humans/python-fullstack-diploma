
from django.core.cache import cache
from django.utils.decorators import method_decorator

from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from core.services.content_validation_service import contains_forbidden_word
from core.services.venue_service import update_venue_views
from core.tasks.send_blocked_venue_banned_words_email_task import send_blocked_venue_banned_words_email_task
from core.tasks.send_venue_added_email_task import send_venue_added_email_task
from core.tasks.send_venue_deleted_email_task import send_venue_deleted_email_task
from drf_yasg.utils import swagger_auto_schema

from apps.venueowners.models import VenueOwnerModel

from .filter import VenueFilter
from .models import VenueModel
from .permissions import IsAdminOrSuperUser, IsOwnerOrAdmin
from .serializers import VenuePhotoSerializer, VenueSerializer


@method_decorator(name='get',decorator=swagger_auto_schema(security=[]))
class VenueListCreateView(ListCreateAPIView):
    """
        get:
            get all owner venues list
        post:
            create new venue
    """
    serializer_class = VenueSerializer
    filterset_class = VenueFilter
    def get_queryset(self):
        return VenueModel.objects.filter(is_active=True)

    def get_permissions(self):
        return [IsAuthenticated()] if self.request.method == 'POST' else [AllowAny()]


    def perform_create(self, serializer):
        owner = VenueOwnerModel.objects.get(user=self.request.user)

        try:
            average_check = int(self.request.data.get('average_check'))
        except (TypeError, ValueError):
            raise ValidationError("Invalid or missing average check.")

        title = self.request.data.get('title', '')
        schedule = self.request.data.get('schedule', '')
        description = self.request.data.get('description', '')
        owner_key = f'bad_word_attempts_{owner.id}'

        if contains_forbidden_word(title) or contains_forbidden_word(schedule) or contains_forbidden_word(description) :
            attempts = cache.get(owner_key, 0) + 1
            cache.set(owner_key, attempts, timeout=3600)

            if attempts >= 3:

                venue = serializer.save(
                    owner=owner,
                    owner_id=owner.id,
                    title=title,
                    schedule=schedule,
                    average_check=average_check,
                    is_active=False,
                    bad_word_attempts=3,
                )

                send_blocked_venue_banned_words_email_task.delay(venue.id)

                cache.delete(owner_key)
                raise ValidationError("Venue is now inactive due to forbidden words. Manager notified.")
            else:
                attempts_left = 3 - attempts
                raise ValidationError(f"Venue contains forbidden words. You have {attempts_left} attempts left.")


        venue = serializer.save(
            owner=owner,
            owner_id=owner.id,
            title=title,
            schedule=schedule,
            average_check=average_check,
            is_active=True,
            is_moderated=True,
            bad_word_attempts=0,
        )

        # update_exchange_rates.apply_async()
        # avg_price_task.apply_async()
        send_venue_added_email_task.delay(
            owner.user.email,
            owner.user.profile.name,
            venue.title,
            venue.schedule,
            venue.average_check,
        )


@method_decorator(name='get',decorator=swagger_auto_schema(security=[]))
class VenueRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    """
        get:
            get venue details by id
        put:
            update venue details by id
        delete:
            delete venue by id
    """
    serializer_class = VenueSerializer
    http_method_names = ['get', 'put', 'delete']
    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAuthenticated(), IsOwnerOrAdmin()]

    def get_queryset(self):
        return VenueModel.objects.filter(is_active=True)


    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        update_venue_views(instance)

        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        venue = self.get_object()
        send_venue_deleted_email_task.delay(
            venue.owner.user.email,
            venue.owner.user.profile.name,
            venue.title,
            venue.schedule,
            venue.average_check,
        )
        self.perform_destroy(venue)
        return Response(status=status.HTTP_204_NO_CONTENT)


class AddPhotoToVenueView(UpdateAPIView):
    """
        put:
            add photo to venue by id
    """

    serializer_class = VenuePhotoSerializer
    queryset = VenueModel.objects.all()
    permission_classes = [IsOwnerOrAdmin, IsAuthenticated]
    http_method_names = ['put']

    def perform_update(self, serializer):
        venue = self.get_object()
        venue.photo.delete()
        super().perform_update(serializer)



class ListInactiveVenueView(ListAPIView):
    """
        get:
            get all inactive venues list
    """

    serializer_class = VenueSerializer
    permission_classes = [IsAdminOrSuperUser]
    queryset = VenueModel.objects.filter(is_active=False)
    http_method_names = ['get']


class DeleteInactiveVenuesView(RetrieveUpdateDestroyAPIView):
    """
        delete:
            delete inactive venue by id
    """

    serializer_class = VenueSerializer
    queryset = VenueModel.objects.filter(is_active=False)
    permission_classes = [IsAdminOrSuperUser]
    http_method_names = ['delete']