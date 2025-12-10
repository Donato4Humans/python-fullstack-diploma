from django_filters import rest_framework as filters


class OwnerFilter(filters.FilterSet):
    order = filters.OrderingFilter(fields=('id',))