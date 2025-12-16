
from rest_framework import serializers

from apps.venues.serializers import VenueSerializer

from ..venues.models import VenueModel
from .models import NewsModel


class NewsSerializer(serializers.ModelSerializer):
    venue = VenueSerializer(read_only=True)
    venue_id = serializers.PrimaryKeyRelatedField(
        queryset=VenueModel.objects.filter(is_active=True, is_moderated=True),
        write_only=True,
        required=False,
        allow_null=True
    )
    venue_title = serializers.CharField(source='venue.title', read_only=True, allow_null=True)

    class Meta:
        model = NewsModel
        fields = (
            'id',
            'title',
            'content',
            'photo',
            'type',
            'is_paid',
            'venue',
            'venue_id',
            'venue_title',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('created_at', 'updated_at')

    def validate(self, attrs):
        user = self.context['request'].user
        is_paid = attrs.get('is_paid', False)

        if is_paid:
            if not user.is_critic and not hasattr(user, 'venue_owners'):
                raise serializers.ValidationError("Only critics or venue owners can create paid news.")

            # Paid news must be linked to a venue (or global for critic)
            if not user.is_critic and not attrs.get('venue_id'):
                raise serializers.ValidationError("Paid venue news must be linked to your venue.")

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        venue_id = validated_data.pop('venue_id', None)

        # Only owner or critic can link to venue
        if venue_id:
            venue = VenueModel.objects.get(id=venue_id)
            if not user.is_superuser and venue.owner.user != user and not user.is_critic:
                raise serializers.ValidationError("You can only post news for your own venue.")
            validated_data['venue'] = venue

        return super().create(validated_data)