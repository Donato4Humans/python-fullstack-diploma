
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from core.services.content_validation_service import contains_forbidden_word

from apps.venues.models import VenueModel

from .models import CommentModel
from .permissions import IsAdminOrSuperUser, IsOwnerOrAdmin
from .serializers import CommentSerializer


class CommentListCreateView(ListCreateAPIView):
    """
        get:
            get all visible comments for venue
        post:
            create comment (moderated by default)
    """
    serializer_class = CommentSerializer
    http_method_names = ['get', 'post']
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        venue_pk = self.kwargs['venue_pk']
        return CommentModel.objects.filter(
            venue_id=venue_pk,
            is_moderated=True
        ).select_related('author__profile')

    def perform_create(self, serializer):
        venue = VenueModel.objects.get(pk=self.kwargs['venue_pk'])

        comment = self.request.data.get('text', '')
        if contains_forbidden_word(comment):
            serializer.save(
                author=self.request.user,
                venue=venue,
                is_moderated=False
            )
        else:
            serializer.save(
            author=self.request.user,
            venue=venue,
            is_moderated=True
            )

class MyCommentsListView(ListAPIView):
    """
        get:
            get all comments written by current user
    """
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return CommentModel.objects.filter(
            author=user,
            is_moderated=True  # only moderated comments
        ).select_related('venue').order_by('-created_at')

class CommentRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    """
        get:
            get comment by id
        put:
            update comment by id
        delete:
            delete comment by id
    """
    serializer_class = CommentSerializer
    http_method_names = ['get', 'put', 'delete']
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        return CommentModel.objects.select_related('author__profile', 'venue')

class BlockedCommentsListView(ListAPIView):
    """
        get:
            get all comments blocked by forbidden words
    """
    serializer_class = CommentSerializer
    http_method_names = ['get']
    permission_classes = [IsAdminOrSuperUser]

    def get_queryset(self):
        return CommentModel.objects.filter(
            is_moderated=False
        ).select_related('author__profile', 'venue')