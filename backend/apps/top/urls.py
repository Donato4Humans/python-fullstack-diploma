
from django.urls import path
from .views import TopVenuesView, TopByCategoryView, TopByTagView

urlpatterns = [
    path('', TopVenuesView.as_view(), name='top_venues'),
    path('/category/<str:category>', TopByCategoryView.as_view(), name='top_by_category'),
    path('/tag/<str:tag_name>', TopByTagView.as_view(), name='top_by_tag'),
]