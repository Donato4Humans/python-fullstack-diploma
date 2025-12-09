from django.contrib.auth import get_user_model

from rest_framework import serializers

UserModel = get_user_model()

class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['password']

class UserRoleSerializer(serializers.Serializer):
    is_user = serializers.BooleanField()
    is_staff = serializers.BooleanField()
    is_critic = serializers.BooleanField()
    is_venue_owner = serializers.BooleanField()
