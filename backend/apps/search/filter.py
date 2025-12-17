
from django_filters import rest_framework as filters

from apps.tag.models import TagModel
from apps.venues.models import VenueModel


class VenueSearchFilter(filters.FilterSet):
    """
        Advanced filters for global search
            Frontend can use:
                ?category=bar
                ?min_rating=4.5
                ?tag=wifi&tag=terrace
                ?min_price=300&max_price=800
    """
    category = filters.ChoiceFilter(choices=VenueModel.CATEGORY_CHOICES)
    min_rating = filters.NumberFilter(field_name='rating', lookup_expr='gte')
    max_rating = filters.NumberFilter(field_name='rating', lookup_expr='lte')
    min_price = filters.NumberFilter(field_name='average_check', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='average_check', lookup_expr='lte')

    tag = filters.ModelMultipleChoiceFilter(
        field_name='venue_tags__tag__name',
        to_field_name='name',
        queryset=TagModel.objects.all(),
        conjoined=False
    )

    order_by = filters.OrderingFilter(
        fields=(
            ('rating', 'rating'),
            ('average_check', 'price'),
            ('created_at', 'newest'),
            ('views', 'popularity'),
        ),
        field_labels={
            'rating': 'Highest rated',
            'average_check': 'Price low to high',
            '-average_check': 'Price high to low',
            '-created_at': 'Newest first',
            '-views': 'Most popular',
        }
    )

    class Meta:
        model = VenueModel
        fields = ['category', 'min_rating', 'max_rating', 'min_price', 'max_price', 'tag']