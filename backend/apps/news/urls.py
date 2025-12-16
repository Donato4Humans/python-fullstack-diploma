
from django.urls import path

from .views import GlobalNewsListView, NewsListCreateView, NewsRetrieveUpdateDestroyView, VenueNewsListView

urlpatterns = [
    path('', NewsListCreateView.as_view(), name='news_list_create'),
    path('/global', GlobalNewsListView.as_view(), name='global_news'),
    path('/venue/<int:venue_pk>', VenueNewsListView.as_view(), name='venue_news'),
    path('/<int:pk>', NewsRetrieveUpdateDestroyView.as_view(), name='news_detail'),
]