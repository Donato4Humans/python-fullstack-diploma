
from django.urls import path

from .views import TagListCreateView, TagRetrieveUpdateDestroyView, VenueTagManagementView

urlpatterns = [
    path('', TagListCreateView.as_view(), name='tag_list_create'),
    path('/<int:pk>', TagRetrieveUpdateDestroyView.as_view(), name='tag_detail'),
    path('/venue/<int:venue_pk>', VenueTagManagementView.as_view(), name='venue_tags'),
]