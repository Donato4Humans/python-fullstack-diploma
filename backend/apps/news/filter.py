from django_filters import rest_framework as filters

from apps.news.models import NewsModel


class NewsFilter(filters.FilterSet):
    type = filters.ChoiceFilter(choices=NewsModel.NEWS_TYPE_CHOICES)
    is_paid = filters.BooleanFilter()
    venue = filters.NumberFilter(field_name='venue_id')

    order = filters.OrderingFilter(
        fields=('created_at', 'title')
    )

    class Meta:
        model = NewsModel
        fields = ['type', 'is_paid', 'venue']