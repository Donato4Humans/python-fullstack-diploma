
from rest_framework import serializers

from .models import VenueModel


class VenueSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    owner_id = serializers.IntegerField(write_only=True, required=False)

    average_check = serializers.IntegerField()
    title = serializers.CharField()
    schedule = serializers.CharField()
    # maybe lon/lat as must field
    favorite_count = serializers.SerializerMethodField()
    piyachok_request_count = serializers.SerializerMethodField()


    rating = serializers.FloatField(read_only=True)
    views = serializers.IntegerField(read_only=True)
    daily_views = serializers.IntegerField(read_only=True)
    weekly_views = serializers.IntegerField(read_only=True)
    monthly_views = serializers.IntegerField(read_only=True)
    last_view_date = serializers.DateTimeField(read_only=True)


    class Meta:
        model = VenueModel
        fields = (
            'id',
            'average_check',
            'favorite_count',
            'rating',
            'latitude',
            'longitude',
            'house',
            'street',
            'country',
            'region',
            'city',
            'title',
            'schedule',
            'description',
            'category',
            'owner',
            'owner_id',
            'photo',
            'views',
            'daily_views',
            'weekly_views',
            'monthly_views',
            'last_view_date',
            'is_active',
            'is_moderated',
            'bad_word_attempts',
        )
        read_only_fields = ['id', 'owner', 'views', 'daily_views', 'weekly_views', 'monthly_views', 'is_active',
                            'is_moderated']


    def create(self, validated_data):

        return super().create(validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')

        if not request:
            return data

        # is_privileged = hasattr(instance.seller, 'premium_account')

        if not instance.owner.user.is_critic and not instance.owner.user.is_superuser:
            for field in [
                'views',
                'daily_views',
                'weekly_views',
                'monthly_views',
                'last_view_date',
            ]:
                data.pop(field, None)



        return data

    def update(self, instance, validated_data):

        return super().update(instance, validated_data)

    def validate_average_check(self, average_check):
        if average_check <= 0:
            raise serializers.ValidationError('Average check must be greater than 0')
        return average_check

    def get_favorite_count(self, obj):
        return obj.favorited_by.count()

    def get_piyachok_request_count(self, obj):
        return obj.piyachok_requests.filter(status='pending').count()


class VenuePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueModel
        fields = ('photo',)