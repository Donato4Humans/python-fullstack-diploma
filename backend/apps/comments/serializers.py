
from rest_framework import serializers

from apps.user.serializers import UserSerializer

from ..venues.models import VenueModel
from .models import CommentModel


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_name = serializers.CharField(source='author.profile.name', read_only=True)
    venue_title = serializers.CharField(source='venue.title', read_only=True)

    class Meta:
        model = CommentModel
        fields = (
            'id',
            'venue_title',
            'author',
            'author_name',
            'text',
            'is_moderated',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('author', 'created_at', 'updated_at', 'venue_title', 'author_name')
        extra_kwargs = {
            'text': {'required': True, 'allow_blank': False},
        }

    def validate(self, attrs):
        user = self.context['request'].user
        venue_pk = self.context['view'].kwargs.get('venue_pk')
        venue = VenueModel.objects.get(pk=venue_pk)

        if venue.is_active == False or venue.is_moderated == False:
            raise serializers.ValidationError("Cannot comment on inactive venue.")

        return attrs