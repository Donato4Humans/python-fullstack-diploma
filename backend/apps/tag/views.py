from rest_framework import serializers
from rest_framework.filters import SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from ..venues.models import VenueModel
from .models import TagModel, VenueTag
from .permissions import IsAdminOrSuperUser, IsOwnerOrAdmin
from .serializers import TagSerializer, VenueTagSerializer


class TagListCreateView(ListCreateAPIView):
    """
        get:
            get list all tags (public)
        post:
            create new tag (only superadmin)
    """
    queryset = TagModel.objects.all().order_by('name')
    http_method_names = ['get', 'post']
    serializer_class = TagSerializer
    filter_backends = [SearchFilter]
    search_fields = ['name']

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminOrSuperUser()]


class TagRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    """
        get:
            get tag detail by id
        put:
            update tag detail by id
        delete:
            delete tag by id
    """
    queryset = TagModel.objects.all()
    http_method_names = ['get', 'put', 'delete']
    serializer_class = TagSerializer
    permission_classes = [IsAdminOrSuperUser]


class VenueTagManagementView(ListCreateAPIView):
    """
        get:
            get list tags for venue
        post:
            add tag to venue (venue owner only)
    """
    serializer_class = VenueTagSerializer
    http_method_names = ['get', 'post']
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        venue_pk = self.kwargs['venue_pk']
        return VenueTag.objects.filter(venue_id=venue_pk).select_related('tag')

    def perform_create(self, serializer):
        venue_pk = self.kwargs['venue_pk']
        venue = VenueModel.objects.get(pk=venue_pk)

        # Only owner or admin
        if venue.owner.user != self.request.user and not self.request.user.is_superuser:
            raise serializers.ValidationError("You can only manage tags for your own venue.")

        serializer.save(venue=venue)