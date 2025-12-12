from django_filters import rest_framework as filters


class VenueFilter(filters.FilterSet):
    lt_rating = filters.NumberFilter(field_name='rating', lookup_expr='lt')
    gt_rating = filters.NumberFilter(field_name='rating', lookup_expr='gt')
    lt_average_check = filters.NumberFilter(field_name='average_check', lookup_expr='lt')
    gt_average_check = filters.NumberFilter(field_name='average_check', lookup_expr='gt')

    icontains_house = filters.CharFilter(field_name='house', lookup_expr='icontains')
    icontains_street = filters.CharFilter(field_name='street', lookup_expr='icontains')
    icontains_city = filters.CharFilter(field_name='city', lookup_expr='icontains')
    icontains_region = filters.CharFilter(field_name='region', lookup_expr='icontains')
    icontains_country = filters.CharFilter(field_name='country', lookup_expr='icontains')

    range_rating = filters.RangeFilter(field_name='rating')
    range_average_check = filters.RangeFilter(field_name='average_check')
    average_check_in = filters.BaseInFilter(field_name='average_check')

    order = filters.OrderingFilter(
        fields=(
            'id',
            'rating',
            'average_check'
        )
    )