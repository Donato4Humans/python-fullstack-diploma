
from django.urls import path

from .views import BlockedCommentsListView, CommentListCreateView, CommentRetrieveUpdateDestroyView

urlpatterns = [
    path('/venue/<int:venue_pk>', CommentListCreateView.as_view(), name='comment_list_create'),
    path('/<int:pk>', CommentRetrieveUpdateDestroyView.as_view(), name='comment_detail'),
    path('/blocked', BlockedCommentsListView.as_view(), name='blocked_comments'),
]