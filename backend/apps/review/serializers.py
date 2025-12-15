
from rest_framework import serializers

from apps.user.serializers import UserSerializer
from apps.venues.models import VenueModel

from .models import ReviewModel


class ReviewSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    venue = serializers.PrimaryKeyRelatedField(
        queryset=VenueModel.objects.filter(is_active=True, is_moderated=True),
        write_only=True
    )
    venue_title = serializers.CharField(source='venue.title', read_only=True)
    author_name = serializers.CharField(source='author.profile.name', read_only=True)
    is_critic_review = serializers.BooleanField(read_only=True)

    class Meta:
        model = ReviewModel
        fields = (
            'id',
            'venue',
            'venue_title',
            'author',
            'author_name',
            'rating',
            'text',
            'is_critic_review',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'author', 'is_critic_review', 'created_at', 'updated_at',
            'venue_title', 'author_name'
        )

    def validate(self, attrs):
        user = self.context['request'].user
        venue = attrs['venue']

        # One review per user per venue
        if ReviewModel.objects.filter(author=user, venue=venue).exists():
            raise serializers.ValidationError("You have already reviewed this venue.")

        return attrs