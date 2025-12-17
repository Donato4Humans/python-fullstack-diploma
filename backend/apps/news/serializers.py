
from rest_framework import serializers

from apps.venues.serializers import VenueSerializer

from ..venues.models import VenueModel
from .models import NewsModel


class NewsSerializer(serializers.ModelSerializer):
    venue = VenueSerializer(read_only=True)
    venue_id = serializers.PrimaryKeyRelatedField(
        queryset=VenueModel.objects.filter(is_active=True, is_moderated=True),
        source='venue',
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
        extra_kwargs = {
            'title': {'required': False},
            'content': {'required': False},
            'type': {'required': False},
            'is_paid': {'required': False},
            'photo': {'required': False},
        }

    def validate(self, attrs):
        user = self.context['request'].user
        is_paid = attrs.get('is_paid', False)
        venue = attrs.get('venue')

        if venue:
            # Superuser and critic can post anywhere
            if user.is_superuser or user.is_critic:
                return attrs

            # Regular user — must be owner of the venue
            if venue.owner.user.id != user.id:
                raise serializers.ValidationError(
                    "You can only post news for your own venue."
                )

        if is_paid:
            if not user.is_critic and not hasattr(user, 'venue_owners'):
                raise serializers.ValidationError(
                    "Only critics or venue owners can create paid news."
                )

            # 2. Regular owners must link paid news to a venue
            if not user.is_critic and venue is None:
                raise serializers.ValidationError(
                    "Paid news must be linked to your venue."
                )

        return attrs