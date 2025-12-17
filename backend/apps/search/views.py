
from django.db.models import Q

from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.search.filter import VenueSearchFilter
from apps.venues.models import VenueModel
from apps.venues.serializers import VenueSerializer


class GlobalSearchView(ListAPIView):
    """
        get:
            get all venues that are suitable to query/filter

        Example /api/search/?q=wi-fi terrace
        Search venues by:
        - title
        - description
        - tags
        - category
    """
    serializer_class = VenueSerializer
    http_method_names = ['get']
    permission_classes = [AllowAny]
    filterset_class = VenueSearchFilter

    def get_queryset(self):
        queryset = VenueModel.objects.filter(
            is_active=True,
            is_moderated=True
        ).select_related('owner__user__profile')

        # filters first (category, price, etc.)
        queryset = self.filterset_class(self.request.query_params, queryset=queryset).qs

        # text search
        query = self.request.query_params.get('q', '').strip()
        if query:
            words = query.split()
            q_objects = Q()
            for word in words:
                q_objects |= (
                        Q(title__icontains=word) |
                        Q(description__icontains=word) |
                        Q(venue_tags__tag__name__iexact=word)
                )
            queryset = queryset.filter(q_objects)

        if not self.request.query_params.get('order_by'):
            queryset = queryset.order_by('-rating', '-views')

        return queryset.distinct()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "count": queryset.count(),
            "results": serializer.data
        })