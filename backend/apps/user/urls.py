from django.urls import path

from . import views
from .views import (
    UserBlockUnblockView,
    UserCreateView,
    UserListView,
    UserRetrieveUpdateDestroyAPIView,
    UserToCriticView,
)

urlpatterns = [
    path('', UserListView.as_view(), name='users_list'),
    path('/me', views.get_current_user, name='current_user'),
    path('/registration', UserCreateView.as_view(), name='user_create'),
    path('/<int:pk>', UserRetrieveUpdateDestroyAPIView.as_view(), name='user_detail_profile'),
    path('/block_unblock/<int:pk>', UserBlockUnblockView.as_view(), name='user_block_unblock'),
    path('/make_critic/<int:pk>', UserToCriticView.as_view(), name='make_critic'),
]