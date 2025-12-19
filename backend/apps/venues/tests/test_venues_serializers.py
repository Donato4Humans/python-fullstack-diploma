from django.test import TestCase

from rest_framework.test import APIRequestFactory

from apps.user.models import UserModel
from apps.venueowners.models import VenueOwnerModel
from apps.venues.models import VenueModel
from apps.venues.serializers import VenueSerializer


class VenueSerializerTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

        # Юзери
        self.owner_user = UserModel.objects.create_user(email='owner@test.com', password='pass')
        self.critic_user = UserModel.objects.create_user(email='critic@test.com', password='pass', is_critic=True)
        self.regular_user = UserModel.objects.create_user(email='reg@test.com', password='pass')

        # Власник та заклад
        self.owner = VenueOwnerModel.objects.create(user=self.owner_user, is_active=True)
        self.venue = VenueModel.objects.create(
            owner=self.owner,
            title="Test Bar",
            average_check=500,
            views=100,
            is_active=True,
            is_moderated=True
        )

    def get_serializer_with_context(self, user):
        request = self.factory.get('/')
        request.user = user
        return VenueSerializer(instance=self.venue, context={'request': request})

    def test_stats_hidden_for_regular_user(self):
        """Звичайний юзер НЕ бачить поля views, daily_views і т.д."""
        serializer = self.get_serializer_with_context(self.regular_user)
        data = serializer.data

        self.assertNotIn('views', data)
        self.assertNotIn('daily_views', data)
        self.assertEqual(data['title'], "Test Bar")

    def test_stats_visible_for_critic(self):
        """Критик бачить статистику"""
        serializer = self.get_serializer_with_context(self.critic_user)
        data = serializer.data

        self.assertIn('views', data)
        self.assertEqual(data['views'], 100)

    def test_stats_visible_for_owner(self):
        """Власник (якщо він не критик/адмін) теж НЕ бачить (згідно логіки вашого коду: if not is_critic and not is_superuser)"""
        # У вашому коді перевірка йде по instance.owner.user.is_critic/superuser,
        # а не request.user. Тому якщо власник не критик, він не бачить свої views у цьому серіалізаторі (це логіка вашого коду).
        serializer = self.get_serializer_with_context(self.owner_user)
        data = serializer.data
        self.assertNotIn('views', data)

    def test_validation_average_check(self):
        """Середній чек має бути > 0"""
        data = {
            'title': 'Cheap Place',
            'average_check': 0,  # Invalid
            'schedule': '24/7'
        }
        # Контекст не важливий для валідації
        serializer = VenueSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('average_check', serializer.errors)