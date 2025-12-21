from django.db import models

from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.permissions import AllowAny

from apps.venues.models import VenueModel
from apps.venues.serializers import VenueSerializer

from .filter import TopVenueFilter
from .models import SponsoredTopModel
from .permissions import IsAdminOrSuperUser
from .serializers import SponsoredTopSerializer


class TopVenuesView(ListAPIView):
    """
        Dynamic tops:
            ?order_by=rating          → Top by rating
            ?order_by=views           → Most viewed
            ?category=bar             → Top bars
            ?tag=wifi&tag=terrace     → Venues with both tags
            ?min_rating=4.5           → Only 4.5+
    """
    serializer_class = VenueSerializer
    permission_classes = [AllowAny]
    filterset_class = TopVenueFilter

    def get_queryset(self):
        queryset = VenueModel.objects.filter(
            is_active=True,
            is_moderated=True
        ).select_related('owner__user__profile')

        request = self.request
        # Default ordering — highest rated
        order_by = request.query_params.get('order_by', 'rating')
        if order_by == 'rating':
            return queryset.order_by('-rating', '-views')
        elif order_by == 'views':
            return queryset.order_by('-views')
        elif order_by == 'newest':
            return queryset.order_by('-created_at')
        else:
            return queryset.order_by('-rating')

class TopByCategoryView(ListAPIView):
    serializer_class = VenueSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category = self.kwargs['category']
        return VenueModel.objects.filter(
            is_active=True,
            is_moderated=True,
            category=category
        ).order_by('-rating')[:10]

class TopByTagView(ListAPIView):
    serializer_class = VenueSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        tag_name = self.kwargs['tag_name']
        return VenueModel.objects.filter(
            is_active=True,
            is_moderated=True,
            venue_tags__tag__name=tag_name
        ).order_by('-rating')[:10]


class SponsoredTopListView(ListAPIView):
    """
        get:
            get admin-moderated sponsored top
    """
    queryset = SponsoredTopModel.objects.select_related('venue').all()
    serializer_class = SponsoredTopSerializer
    permission_classes = [AllowAny]

class SponsoredTopAdminView(ListCreateAPIView):
    """
        get:
            get sponsored top by admin
        post:
             update sponsored top by admin
    """
    queryset = SponsoredTopModel.objects.select_related('venue').all()
    serializer_class = SponsoredTopSerializer
    permission_classes = [IsAdminOrSuperUser]

    def perform_create(self, serializer):
        # Auto-assign next position if not provided (avoid unique conflicts)
        if not serializer.validated_data.get('position'):
            max_pos = SponsoredTopModel.objects.aggregate(models.Max('position'))['position__max'] or 0
            serializer.validated_data['position'] = max_pos + 1
        serializer.save()