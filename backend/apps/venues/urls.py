from django.urls import path

from .views import (
    AddPhotoToVenueView,
    DeleteInactiveVenuesView,
    ListInactiveVenueView,
    VenueListCreateView,
    VenueRetrieveUpdateDestroyView,
)

urlpatterns = [
    path('', VenueListCreateView.as_view(), name='venue_list'),
    path('/<int:pk>', VenueRetrieveUpdateDestroyView.as_view(), name='venue_detail'),
    path('/photo/<int:pk>', AddPhotoToVenueView.as_view(), name='add_photo'),
    path('/inactive', ListInactiveVenueView.as_view(), name='venue_inactive'),
    path('/inactive/delete/<int:pk>', DeleteInactiveVenuesView.as_view(), name='venue_inactive_delete'),
]