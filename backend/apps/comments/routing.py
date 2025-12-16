
from django.urls import path

from .consumers import CommentConsumer

websocket_urlpatterns = [
    path('', CommentConsumer.as_asgi(), name='comments_websocket'),
]