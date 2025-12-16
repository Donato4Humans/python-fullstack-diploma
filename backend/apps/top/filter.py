
from django_filters import rest_framework as filters

from apps.tag.models import TagModel
from apps.venues.models import VenueModel


class TopVenueFilter(filters.FilterSet):
    category = filters.ChoiceFilter(choices=VenueModel.category)
    tag = filters.ModelMultipleChoiceFilter(
        field_name='venue_tags__tag__name',
        to_field_name='name',
        queryset=TagModel.objects.all()
    )
    min_rating = filters.NumberFilter(field_name='rating', lookup_expr='gte')
    max_rating = filters.NumberFilter(field_name='rating', lookup_expr='lte')

    order_by = filters.OrderingFilter(
        fields=(
            ('rating', 'rating'),
            ('views', 'views'),
            ('daily_views', 'daily_views'),
            ('created_at', 'newest'),
        ),
        field_labels={
            'rating': 'Highest rated',
            'views': 'Most viewed',
            '-created_at': 'Newest',
        }
    )

    class Meta:
        model = VenueModel
        fields = ['category', 'tag', 'min_rating', 'max_rating']