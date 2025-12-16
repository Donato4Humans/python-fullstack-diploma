
from rest_framework import status
from rest_framework.generics import DestroyAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import FavoriteModel
from .serializers import FavoriteSerializer


class FavoriteListCreateView(ListCreateAPIView):
    """
        get:
            get all user's favorite venues
        post:
            add venue to favorites
    """
    serializer_class = FavoriteSerializer
    http_method_names = ['get', 'post']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FavoriteModel.objects.filter(
            user=self.request.user
        ).select_related('venue')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FavoriteDestroyView(DestroyAPIView):
    """
        delete:
            remove venue from favorites
    """
    permission_classes = [IsAuthenticated]
    http_method_names = ['delete']

    def get_queryset(self):
        return FavoriteModel.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"detail": "Removed from favorites"}, status=status.HTTP_200_OK)