from django.urls import path

from .consumers import VenueConsumer

websocket_urlpatterns = [
    path('', VenueConsumer.as_asgi(), name='venues_websocket'),
]