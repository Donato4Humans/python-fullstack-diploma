
from django.urls import path

from .consumers import PiyachokRequestConsumer

websocket_urlpatterns = [
    path('', PiyachokRequestConsumer.as_asgi(), name='piyachok_request_websocket'),
]