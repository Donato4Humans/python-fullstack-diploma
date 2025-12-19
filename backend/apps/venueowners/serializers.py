from rest_framework import serializers

from apps.user.serializers import UserSerializer
from apps.venueowners.models import VenueOwnerModel
from apps.venues.serializers import VenueSerializer


class OwnerSerializer(serializers.ModelSerializer):
    venues = VenueSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = VenueOwnerModel
        fields = (
            'id',
            'user',
            'updated_at',
            'created_at',
            'venues',
            'is_active'
        )
        read_only_fields = ('user', 'is_active')


    def create(self, validated_data):
        user = self.context['request'].user
        validated_data.pop('user', None)
        owner = VenueOwnerModel.objects.create(user=user, **validated_data)

        return  owner