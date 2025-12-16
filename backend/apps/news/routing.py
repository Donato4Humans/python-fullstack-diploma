from django.urls import path

from .consumers import NewsConsumer

websocket_urlpatterns = [
    path('', NewsConsumer.as_asgi(), name='news_websocket'),
]