
from django.core.cache import cache
from django.utils.decorators import method_decorator

from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from core.services.content_validation_service import contains_forbidden_word
from core.services.venue_service import update_venue_views
from core.tasks.send_blocked_listing_banned_words_email_task import send_blocked_listing_banned_words_email_task
from core.tasks.send_listing_added_email_task import send_listing_added_email_task
from core.tasks.send_listing_deleted_email_task import send_listing_deleted_email_task
from drf_yasg.utils import swagger_auto_schema

from apps.venueowners.models import VenueOwnerModel

from .models import VenueModel
from .permissions import IsAdminOrSuperUser, IsOwnerOrAdmin
from .serializers import ListingPhotoSerializer, ListingSerializer


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

        # can_create, error_message = check_seller_listing_limit(seller)
        # if not can_create:
        #     raise ValidationError(error_message, status.HTTP_400_BAD_REQUEST)

        try:
            average_check = int(self.request.data.get('average_check'))
        except (TypeError, ValueError):
            raise ValidationError("Invalid or missing average check.")

        # currency = self.request.data.get('currency')
        # if currency not in ['USD', 'EUR', 'UAH']:
        #     raise ValidationError("Invalid or missing currency.")

        # price_usd, price_eur, price_uah = calculate_prices(price, currency)

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


        listings = serializer.save(
            seller=seller,
            currency=currency,
            price=price,
            price_usd=price_usd,
            price_eur=price_eur,
            price_uah=price_uah,
            exchange_rate_used=get_exchange_rates()['updated'],
            is_active=True,
            bad_word_attempts=0,
        )

        update_exchange_rates.apply_async()
        avg_price_task.apply_async()
        send_listing_added_email_task.delay(
            seller.user.email,
            seller.user.profile.name,
            listings.brand.brand,
            listings.car_model.car_model,
            price=str(listings.price),
        )


@method_decorator(name='get',decorator=swagger_auto_schema(security=[]))
class ListingRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    """
        get:
            get listing details by id
        put:
            update listing details by id
        delete:
            delete listing by id
    """
    serializer_class = ListingSerializer
    http_method_names = ['get', 'put', 'delete']
    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAuthenticated(), IsOwnerOrAdmin()]

    def get_queryset(self):
        return ListingSellersModel.objects.filter(is_active=True)


    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        update_listing_views(instance)

        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        listing = self.get_object()
        send_listing_deleted_email_task.delay(
            listing.seller.user.email,
            listing.seller.user.profile.name,
            listing.brand.brand,
            listing.car_model.car_model,
            price=str(listing.price),
        )
        self.perform_destroy(listing)
        return Response(status=status.HTTP_204_NO_CONTENT)


class AddPhotoToListingView(UpdateAPIView):
    """
        put:
            add photo to listing by id
    """

    serializer_class = ListingPhotoSerializer
    queryset = ListingSellersModel.objects.all()
    permission_classes = [IsOwnerOrAdmin, IsAuthenticated]
    http_method_names = ['put']

    def perform_update(self, serializer):
        listing = self.get_object()
        listing.photo.delete()
        super().perform_update(serializer)



class ListInactiveListingView(ListAPIView):
    """
        get:
            get all inactive listings list
    """

    serializer_class = ListingSerializer
    permission_classes = [IsAdminOrSuperUser]
    queryset = ListingSellersModel.objects.filter(is_active=False)
    http_method_names = ['get']


class DeleteInactiveListingsView(RetrieveUpdateDestroyAPIView):
    """
        delete:
            delete inactive listing by id
    """

    serializer_class = ListingSerializer
    queryset = ListingSellersModel.objects.filter(is_active=False)
    permission_classes = [IsAdminOrSuperUser]
    http_method_names = ['delete']