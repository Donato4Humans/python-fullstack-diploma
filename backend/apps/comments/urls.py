
from django.urls import path

from .views import BlockedCommentsListView, CommentListCreateView, CommentRetrieveUpdateDestroyView, MyCommentsListView

urlpatterns = [
    path('/venue/<int:venue_pk>', CommentListCreateView.as_view(), name='comments_by_venue_list_create'),
    path('/my', MyCommentsListView.as_view(), name='user_comments'),
    path('/<int:pk>', CommentRetrieveUpdateDestroyView.as_view(), name='comment_detail'),
    path('/blocked', BlockedCommentsListView.as_view(), name='blocked_comments'),
]