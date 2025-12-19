from django.test import TestCase

from rest_framework.exceptions import ValidationError
from rest_framework.test import APIRequestFactory

from apps.piyachok.models import PiyachokRequestModel
from apps.piyachok.serializers import PiyachokRequestSerializer
from apps.user.models import ProfileModel, UserModel
from apps.venues.models import VenueModel


class PiyachokSerializerTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

        # 1. Юзер
        self.user = UserModel.objects.create_user(email='test@test.com', password='password')
        ProfileModel.objects.create(user=self.user, name="Tester")

        # 2. Заклади
        self.active_venue = VenueModel.objects.create(
            title="Open Bar", is_active=True, is_moderated=True, owner=self.user
        )
        self.closed_venue = VenueModel.objects.create(
            title="Closed Bar", is_active=False, is_moderated=True, owner=self.user
        )

    def get_context(self):
        request = self.factory.get('/')
        request.user = self.user
        return {'request': request}

    def test_valid_request_creation(self):
        """Тест створення валідної заявки"""
        data = {
            'budget': 500,
            'who_pays': 'me',
            'preferred_venue_id': self.active_venue.id
        }
        serializer = PiyachokRequestSerializer(data=data, context=self.get_context())
        self.assertTrue(serializer.is_valid())

    def test_inactive_venue_validation(self):
        """Не можна вибрати неактивний заклад"""
        data = {
            'budget': 500,
            'who_pays': 'me',
            'preferred_venue_id': self.closed_venue.id
        }
        serializer = PiyachokRequestSerializer(data=data, context=self.get_context())

        self.assertFalse(serializer.is_valid())
        self.assertIn('preferred_venue_id', serializer.errors)

    def test_limit_active_requests(self):
        """Не можна мати більше 3 активних заявок"""
        # Створюємо 3 активні заявки
        for i in range(3):
            PiyachokRequestModel.objects.create(
                requester=self.user, status='pending', budget=100, who_pays='split'
            )

        # Спробуємо створити 4-ту
        data = {'budget': 500, 'who_pays': 'me'}
        serializer = PiyachokRequestSerializer(data=data, context=self.get_context())

        with self.assertRaises(ValidationError) as cm:
            serializer.is_valid(raise_exception=True)
        self.assertIn("You can have maximum 3 active requests", str(cm.exception))

    def test_update_non_pending_request(self):
        """Не можна редагувати заявку, яка вже не pending (наприклад, matched)"""
        request = PiyachokRequestModel.objects.create(
            requester=self.user, status='matched', budget=100, who_pays='split'
        )

        data = {'budget': 1000}
        serializer = PiyachokRequestSerializer(instance=request, data=data, context=self.get_context(), partial=True)

        with self.assertRaises(ValidationError) as cm:
            serializer.is_valid(raise_exception=True)
        self.assertIn("Cannot update request that is no longer pending", str(cm.exception))