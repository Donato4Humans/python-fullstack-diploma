from email.policy import default

from rest_framework import serializers

from apps.user.serializers import UserSerializer
from apps.venues.serializers import VenueSerializer

from ..venues.models import VenueModel
from .models import MatchModel, PiyachokRequestModel


class PiyachokRequestSerializer(serializers.ModelSerializer):
    requester = UserSerializer(read_only=True)
    preferred_venue = VenueSerializer(read_only=True)
    preferred_venue_id = serializers.PrimaryKeyRelatedField(
        queryset=VenueModel.objects.filter(is_active=True, is_moderated=True),
        source='preferred_venue',
        write_only=True,
        required=True,
        allow_null=True
    )
    requester_name = serializers.CharField(source='requester.profile.name', read_only=True)
    venue_title = serializers.CharField(source='preferred_venue.title', read_only=True)

    class Meta:
        model = PiyachokRequestModel
        fields = (
            'id',
            'requester',
            'requester_name',
            'gender_preference',
            'budget',
            'who_pays',
            'preferred_venue',
            'preferred_venue_id',
            'venue_title',
            'status',
            'note',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('status', 'created_at', 'updated_at', 'requester')
        extra_kwargs = {
            'gender_preference': {'required': False, 'default': 'A'},
            'budget': {'required': True},
            'who_pays': {'required': True},
            'preferred_venue_id': {'required': False},
            'note': {'required': False, 'allow_blank': True},
        }

    def validate(self, attrs):
        instance = self.instance
        if instance and instance.status != 'pending':
            raise serializers.ValidationError("Cannot update request that is no longer pending.")



        user = self.context['request'].user
        # limit number of active requests per user
        if 'budget' in attrs or 'gender_preference' in attrs:  # if changing key fields
            active_requests = PiyachokRequestModel.objects.filter(
                requester=user,
                status='pending'
            ).exclude(pk=instance.pk if instance else None).count()
            if active_requests >= 3:
                raise serializers.ValidationError("You can have maximum 3 active requests.")
        return attrs


class MatchSerializer(serializers.ModelSerializer):
    request1 = PiyachokRequestSerializer(read_only=True)
    request2 = PiyachokRequestSerializer(read_only=True)
    suggested_venue = VenueSerializer(read_only=True)

    class Meta:
        model = MatchModel
        fields = (
            'id',
            'request1',
            'request2',
            'suggested_venue',
            'is_accepted',
            'note',
            'created_at',
        )
        read_only_fields = ('created_at',)