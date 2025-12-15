from django.urls import path

from .consumers import ReviewConsumer

websocket_urlpatterns = [
    path('', ReviewConsumer.as_asgi(), name='reviews_websocket'),
]