
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from apps.venues.models import VenueModel

from .models import ReviewModel
from .permissions import IsOwnerOrAdmin
from .serializers import ReviewSerializer


class ReviewListCreateView(ListCreateAPIView):
    """
        get:
            list all reviews for a venue
        post:
            create new review
    """
    serializer_class = ReviewSerializer
    http_method_names = ['get', 'post']

    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAuthenticated()]

    def get_queryset(self):
        venue_pk = self.kwargs['venue_pk']
        return ReviewModel.objects.filter(venue_id=venue_pk, is_moderated=True).select_related('author__profile')

    def perform_create(self, serializer):
        venue = VenueModel.objects.get(
            pk=self.kwargs['venue_pk']
        )
        serializer.save(
            author=self.request.user,
            venue=venue
        )


class MyReviewsListView(ListAPIView):
    """
        get:
            get list of all reviews by current user
    """
    serializer_class = ReviewSerializer
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ReviewModel.objects.filter(
            author=user
        ).select_related('venue').order_by('-created_at')

class ReviewRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    """
        get:
            get review by id
        put:
            update review details by id
        delete:
            delete review by id
    """
    serializer_class = ReviewSerializer
    http_method_names = ['get', 'put', 'delete']
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        return ReviewModel.objects.select_related('author__profile', 'venue')

    def perform_update(self, serializer):
        review = serializer.save()
        review.venue.update_rating()  # update average after change

    def perform_destroy(self, instance):
        venue = instance.venue
        instance.delete()
        venue.update_rating()  # update average after delete