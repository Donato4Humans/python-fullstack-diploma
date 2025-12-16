from rest_framework import serializers

from apps.top.models import SponsoredTopModel
from apps.venues.serializers import VenueSerializer


class SponsoredTopSerializer(serializers.ModelSerializer):
    venue = VenueSerializer(read_only=True)

    class Meta:
        model = SponsoredTopModel
        fields = ('id', 'venue', 'position', 'note', 'created_at')
        read_only_fields = ('created_at',)