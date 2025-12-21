from rest_framework import serializers

from apps.top.models import SponsoredTopModel
from apps.venues.models import VenueModel
from apps.venues.serializers import VenueSerializer


class SponsoredTopSerializer(serializers.ModelSerializer):
    venue = VenueSerializer(read_only=True)
    venue_id = serializers.PrimaryKeyRelatedField(  # Add this line
        queryset=VenueModel.objects.filter(is_active=True, is_moderated=True),
        source='venue',
        write_only=True,
    )

    class Meta:
        model = SponsoredTopModel
        fields = ('id', 'venue', 'venue_id', 'position', 'note', 'created_at')
        read_only_fields = ('created_at',)