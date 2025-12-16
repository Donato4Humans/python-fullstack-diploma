
from django.urls import path

from .views import (
    MatchAcceptView,
    MyMatchesListView,
    PiyachokRequestDetailView,
    PiyachokRequestListCreateView,
    RunMatchingView,
)

urlpatterns = [
    path('/requests', PiyachokRequestListCreateView.as_view(), name='piyachok_requests'),
    path('/requests/<int:pk>', PiyachokRequestDetailView.as_view(), name='piyachok_request_detail'),
    path('/matches', MyMatchesListView.as_view(), name='my_matches'),
    path('/matches/<int:pk>/accept', MatchAcceptView.as_view(), name='match_accept'),
    path('/run-matching', RunMatchingView.as_view(), name='run_matching_test'),
]