from django.test import TestCase

from rest_framework.exceptions import ValidationError
from rest_framework.test import APIRequestFactory

from apps.news.serializers import NewsSerializer
from apps.user.models import UserModel
from apps.venues.models import VenueModel


class NewsSerializerTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

        # 1. Юзери
        self.owner_user = UserModel.objects.create_user(
            email='owner@test.com', password='pass', is_critic=False
        )
        # Припускаємо, що у моделі User є поле is_critic
        self.critic_user = UserModel.objects.create_user(
            email='critic@test.com', password='pass', is_critic=True
        )
        self.stranger = UserModel.objects.create_user(
            email='stranger@test.com', password='pass'
        )

        # 2. Заклади (Важливо: is_active=True, is_moderated=True для queryset)
        self.venue = VenueModel.objects.create(
            title="My Bar", is_active=True, is_moderated=True, owner=self.owner_user
        )
        self.other_venue = VenueModel.objects.create(
            title="Other Bar", is_active=True, is_moderated=True, owner=self.stranger
        )

    def get_context(self, user):
        request = self.factory.get('/')
        request.user = user
        return {'request': request}

    def test_owner_create_news_for_own_venue(self):
        """Власник створює новину для свого закладу -> ОК"""
        data = {
            'title': 'Party tonight',
            'venue_id': self.venue.id
        }
        serializer = NewsSerializer(data=data, context=self.get_context(self.owner_user))
        self.assertTrue(serializer.is_valid())

    def test_owner_create_news_for_other_venue(self):
        """Власник намагається створити новину для чужого закладу -> Помилка"""
        data = {
            'title': 'Hacking',
            'venue_id': self.other_venue.id
        }
        serializer = NewsSerializer(data=data, context=self.get_context(self.owner_user))

        with self.assertRaises(ValidationError) as cm:
            serializer.is_valid(raise_exception=True)
        self.assertIn("You can only post news for your own venue", str(cm.exception))

    def test_paid_news_without_venue_regular_user(self):
        """Звичайний власник створює платну новину без закладу -> Помилка"""
        data = {
            'title': 'Paid Global',
            'is_paid': True,
            'venue_id': None  # або взагалі не передаємо
        }
        serializer = NewsSerializer(data=data, context=self.get_context(self.owner_user))

        with self.assertRaises(ValidationError) as cm:
            serializer.is_valid(raise_exception=True)
        self.assertIn("Paid news must be linked to your venue", str(cm.exception))

    def test_critic_can_post_anywhere(self):
        """Критик може постити навіть у чужий заклад (за логікою коду)"""
        data = {
            'title': 'Review',
            'venue_id': self.venue.id  # Заклад owner_user
        }
        # Контекст - критик
        serializer = NewsSerializer(data=data, context=self.get_context(self.critic_user))
        self.assertTrue(serializer.is_valid())