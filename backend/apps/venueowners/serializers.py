from rest_framework import serializers

# from apps.base_account.models import BaseAccountModel
from apps.user.serializers import UserSerializer
from apps.venueowners.models import VenueOwnerModel


class OwnerSerializer(serializers.ModelSerializer):
    venues = VenueSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    # account_type = serializers.SerializerMethodField()

    class Meta:
        model = VenueOwnerModel
        fields = (
            'id',
            'user',
            'updated_at',
            'created_at',
            'venues',
            # 'account_type',
        )


    # def get_account_type(self, obj):
    #     if hasattr(obj, 'premium_account'):
    #         return 'Premium'
    #     elif hasattr(obj, 'base_account'):
    #         return 'Base'
    #
    #     return 'Unknown'


    def create(self, validated_data):
        user = self.context['request'].user
        validated_data.pop('user', None)
        owner = VenueOwnerModel.objects.create(user=user, **validated_data)
        # BaseAccountModel.objects.create(seller=seller)

        return  owner