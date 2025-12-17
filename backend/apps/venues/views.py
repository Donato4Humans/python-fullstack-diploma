
from django.core.cache import cache
from django.utils.decorators import method_decorator

from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import (
    GenericAPIView,
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    UpdateAPIView,
    get_object_or_404,
)
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
        return VenueModel.objects.filter(is_active=True, is_moderated=True)

    def get_permissions(self):
        return [IsAuthenticated()] if self.request.method == 'POST' else [AllowAny()]


    def perform_create(self, serializer):
        # if not hasattr(self.request.user, 'venue_owners'):
        #     raise ValidationError('You must become owner to create a new venue')
        #
        # owner = VenueOwnerModel.objects.get(user=self.request.user)
        user = self.request.user

        owner, created = VenueOwnerModel.objects.get_or_create(
             user=user,
             defaults={'is_active': True}
        )

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
                    is_active=False,
                    bad_word_attempts=3,
                )

                send_blocked_venue_banned_words_email_task.delay(venue.id)

                cache.delete(owner_key)
                raise ValidationError("Venue is now inactive due to forbidden words. Manager notified.")
            else:
                attempts_left = 3 - attempts
                raise ValidationError(f"Venue contains forbidden words. You have {attempts_left} attempts left.")
        else:
            venue = serializer.save(
                owner=owner,
                owner_id=owner.id,
                is_active=True,
                is_moderated=False,
                bad_word_attempts=0,
            )
            admin_name = owner.user.email.split('@')[0]
            send_venue_added_email_task.delay(
                owner.user.email,
                owner.user.profile.name if not owner.user.is_superuser else admin_name,
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
        admin_name = venue.owner.user.email.split('@')[0]
        send_venue_deleted_email_task.delay(
            venue.owner.user.email,
            venue.owner.user.profile.name if not venue.owner.user.is_superuser else admin_name,
            venue.title,
            venue.schedule,
            venue.average_check,
        )
        self.perform_destroy(venue)
        return Response(status=status.HTTP_204_NO_CONTENT)


class VenueTransferOwnershipView(GenericAPIView):
    """
        patch:
            transfer venue ownership to another user
    """
    permission_classes = [IsAdminOrSuperUser]

    def patch(self, request, pk):
        venue = get_object_or_404(VenueModel, pk=pk)
        new_owner_id = request.data.get('new_owner_id')

        if not new_owner_id:
            return Response(
                {"detail": "new_owner_id required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            new_owner = VenueOwnerModel.objects.get(id=new_owner_id)
        except VenueOwnerModel.DoesNotExist:
            return Response(
                {"detail": "New owner not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        old_owner = venue.owner
        venue.owner = new_owner
        venue.save()

        return Response({
            "detail": f"Venue transferred from {old_owner.user.email} to {new_owner.user.email}",
            "venue_id": venue.id,
            "new_owner": new_owner.user.email
        })

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
    queryset = VenueModel.objects.filter(is_active=False, is_moderated=False)
    http_method_names = ['get']


class DeleteInactiveVenuesView(RetrieveUpdateDestroyAPIView):
    """
        delete:
            delete inactive venue by id
    """

    serializer_class = VenueSerializer
    queryset = VenueModel.objects.filter(is_active=False, is_moderated=False)
    permission_classes = [IsAdminOrSuperUser]
    http_method_names = ['delete']