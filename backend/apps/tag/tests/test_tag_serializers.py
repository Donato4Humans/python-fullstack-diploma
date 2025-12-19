from django.test import TestCase

from rest_framework.test import APIRequestFactory

from apps.tag.models import TagModel, VenueTag
from apps.tag.serializers import TagSerializer, VenueTagSerializer
from apps.user.models import UserModel
from apps.venues.models import VenueModel


class TagSerializerTests(TestCase):
    def setUp(self):
        self.tag = TagModel.objects.create(name="WiFi")

        # Для VenueTag нам потрібен заклад
        self.user = UserModel.objects.create_user(email='test@test.com', password='pass')
        self.venue = VenueModel.objects.create(
            title="Cafe", is_active=True, is_moderated=True, owner=self.user
        )

    def test_tag_serializer(self):
        """Тест серіалізатора тегу"""
        data = {'name': 'Terrace'}
        serializer = TagSerializer(data=data)

        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['name'], 'Terrace')

    def test_venue_tag_serializer(self):
        """Тест прив'язки тегу до закладу"""
        # VenueTagSerializer приймає tag_id
        data = {'tag_id': self.tag.id}

        # Контекст тут не обов'язковий, але корисний для звички
        serializer = VenueTagSerializer(data=data)

        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['tag'], self.tag)