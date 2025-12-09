from rest_framework import serializers

from apps.forbiddenwords.models import Forbiddenwords


class ForbiddenWordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Forbiddenwords
        fields = ('id', 'word')