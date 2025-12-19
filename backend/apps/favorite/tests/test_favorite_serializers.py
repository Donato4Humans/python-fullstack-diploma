from django.test import TestCase

from rest_framework.exceptions import ValidationError
from rest_framework.test import APIRequestFactory

from apps.favorite.models import FavoriteModel
from apps.favorite.serializers import FavoriteSerializer
from apps.user.models import ProfileModel, UserModel
from apps.venues.models import VenueModel


class FavoriteSerializerTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

        # 1. Створюємо юзера
        self.user = UserModel.objects.create_user(
            email='user@test.com', password='password', is_active=True
        )
        ProfileModel.objects.create(user=self.user, name="Tester")

        # 2. Активний заклад
        self.active_venue = VenueModel.objects.create(
            title="Good Venue", is_active=True, is_moderated=True, owner=self.user
        )

        # 3. Неактивний заклад
        self.inactive_venue = VenueModel.objects.create(
            title="Closed Venue", is_active=False, is_moderated=True, owner=self.user
        )

    def get_context(self):
        """Допоміжний метод для контексту запиту"""
        request = self.factory.post('/')
        request.user = self.user
        return {'request': request}

    def test_valid_favorite(self):
        """Тест: валідні дані проходять перевірку"""
        data = {'venue_id': self.active_venue.id}
        serializer = FavoriteSerializer(data=data, context=self.get_context())

        self.assertTrue(serializer.is_valid())

    def test_duplicate_favorite_validation(self):
        """Тест: не можна додати той самий заклад двічі"""
        # Створюємо запис у базі
        FavoriteModel.objects.create(user=self.user, venue=self.active_venue)

        # Пробуємо додати його знову
        data = {'venue_id': self.active_venue.id}
        serializer = FavoriteSerializer(data=data, context=self.get_context())

        with self.assertRaises(ValidationError) as cm:
            serializer.is_valid(raise_exception=True)

        self.assertIn("This venue is already in your favorites", str(cm.exception))

    def test_inactive_venue_validation(self):
        """Тест: не можна додати неактивний заклад"""
        data = {'venue_id': self.inactive_venue.id}
        serializer = FavoriteSerializer(data=data, context=self.get_context())

        # PrimaryKeyRelatedField з фільтром queryset викине помилку, що об'єкт не знайдено або він невалідний
        self.assertFalse(serializer.is_valid())
        self.assertIn('venue_id', serializer.errors)