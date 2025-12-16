from rest_framework import status
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .filter import NewsFilter
from .models import NewsModel
from .permissions import IsOwnerOrAdmin
from .serializers import NewsSerializer


class NewsListCreateView(ListCreateAPIView):
    """
        get:
            get all news (global + venue)
        post:
            create news (global for critic/admin, venue for owner)
    """
    serializer_class = NewsSerializer
    filterset_class = NewsFilter
    http_method_names = ['get', 'post']
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        # Global + all venue news
        return NewsModel.objects.select_related('venue').all()


class GlobalNewsListView(ListAPIView):
    """
        get:
            get only global news
    """
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]
    queryset = NewsModel.objects.filter(venue=None)
    http_method_names = ['get']


class VenueNewsListView(ListAPIView):
    """
        get:
            get news for specific venue
    """
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]
    http_method_names = ['get']

    def get_queryset(self):
        venue_pk = self.kwargs['venue_pk']
        return NewsModel.objects.filter(venue_id=venue_pk)


class NewsRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    """
        get:
            get news by id
        put:
            update news by id
        delete:
            delete news by id
    """
    serializer_class = NewsSerializer
    http_method_names = ['get', 'put', 'delete']
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        return NewsModel.objects.select_related('venue')

    def perform_destroy(self, instance):
        if instance.photo:
            instance.photo.delete(save=False)
        instance.delete()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"detail": "News deleted successfully"}, status=status.HTTP_200_OK)