
from rest_framework import serializers

from apps.venues.serializers import VenueSerializer

from ..venues.models import VenueModel
from .models import FavoriteModel


class FavoriteSerializer(serializers.ModelSerializer):
    venue = VenueSerializer(read_only=True)
    venue_id = serializers.PrimaryKeyRelatedField(
        queryset=VenueModel.objects.filter(is_active=True, is_moderated=True),
        source='venue',
        write_only=True
    )

    class Meta:
        model = FavoriteModel
        fields = ('id', 'venue', 'venue_id', 'created_at')
        read_only_fields = ('created_at',)

    def validate_venue_id(self, venue):
        user = self.context['request'].user
        if FavoriteModel.objects.filter(user=user, venue=venue).exists():
            raise serializers.ValidationError("This venue is already in your favorites.")
        return venue