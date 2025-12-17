
from django.urls import path

from .views import (
    ActiveRequestsListView,
    JoinRequestView,
    MatchAcceptView,
    MyMatchesListView,
    PiyachokRequestDetailView,
    PiyachokRequestListCreateView,
    RunMatchingView,
)

urlpatterns = [
    path('/requests', PiyachokRequestListCreateView.as_view(), name='all_piyachok_requests'),
    path('/requests/<int:pk>', PiyachokRequestDetailView.as_view(), name='piyachok_request_detail'),
    path('/matches', MyMatchesListView.as_view(), name='my_matches'),
    path('/matches/<int:pk>/accept', MatchAcceptView.as_view(), name='match_accept'),
    path('/active', ActiveRequestsListView.as_view(), name='active_requests'),
    path('/join/<int:pk>', JoinRequestView.as_view(), name='join_request'),
    path('/run-matching', RunMatchingView.as_view(), name='run_matching_test'),
]