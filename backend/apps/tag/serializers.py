
from rest_framework import serializers

from .models import TagModel, VenueTag


class TagSerializer(serializers.ModelSerializer):
    """
        Simple tag serializer
        Only superadmin can create/update
    """
    class Meta:
        model = TagModel
        fields = ('id', 'name', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')


class VenueTagSerializer(serializers.ModelSerializer):
    """
        Venue-Tag relationship
        Used for listing tags on venue
    """
    tag = TagSerializer(read_only=True)
    tag_id = serializers.PrimaryKeyRelatedField(
        queryset=TagModel.objects.all(),
        source='tag',
        write_only=True
    )

    class Meta:
        model = VenueTag
        fields = ('id', 'tag', 'tag_id', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')