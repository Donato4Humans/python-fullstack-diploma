
from django.urls import path

from .views import MyReviewsListView, ReviewListCreateView, ReviewRetrieveUpdateDestroyView

urlpatterns = [
    path('/venue/<int:venue_pk>', ReviewListCreateView.as_view(), name='review_list_create'),
    path('/my', MyReviewsListView.as_view(), name='my_reviews'),
    path('/<int:pk>', ReviewRetrieveUpdateDestroyView.as_view(), name='review_detail'),
]