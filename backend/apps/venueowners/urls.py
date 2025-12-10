from django.urls import path

from .views import OwnersListCreateView, OwnersRetrieveUpdateDestroyView  # PremiumAccountPurchaseApiView

urlpatterns = [
    path('', OwnersListCreateView.as_view(), name='owners_list'),
    path('/<int:pk>', OwnersRetrieveUpdateDestroyView.as_view(), name='owners_detail'),
    # path('/buy_premium', PremiumAccountPurchaseApiView.as_view(), name='buy_premium'),
]