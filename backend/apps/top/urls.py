
from django.urls import path

from .views import SponsoredTopAdminView, SponsoredTopListView, TopByCategoryView, TopByTagView, TopVenuesView

urlpatterns = [
    path('', TopVenuesView.as_view(), name='top_venues'),
    path('/category/<str:category>', TopByCategoryView.as_view(), name='top_by_category'),
    path('/tag/<str:tag_name>', TopByTagView.as_view(), name='top_by_tag'),
    path('/sponsored', SponsoredTopListView.as_view(), name='sponsored_top'),
    path('/sponsored/admin', SponsoredTopAdminView.as_view(), name='sponsored_top_admin'),
]