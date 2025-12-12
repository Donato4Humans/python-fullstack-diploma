from django.urls import path

from channels.routing import URLRouter

from apps.chat.routing import websocket_urlpatterns as chat_routing
from apps.venues.routing import websocket_urlpatterns as venues_routing

websocket_urlpatterns = [
    path('api/chat/', URLRouter(chat_routing)),
    path('api/venues/', URLRouter(venues_routing)),

]