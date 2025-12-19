from django.test import TestCase

from rest_framework.exceptions import ValidationError
from rest_framework.test import APIRequestFactory

from apps.review.models import ReviewModel
from apps.review.serializers import ReviewSerializer
from apps.user.models import ProfileModel, UserModel
from apps.venues.models import VenueModel


class ReviewSerializerTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

        # 1. Юзер та профіль
        self.user = UserModel.objects.create_user(email='test@test.com', password='password')
        ProfileModel.objects.create(user=self.user, name="Tester")

        # 2. Заклад
        self.venue = VenueModel.objects.create(
            title="Bar", is_active=True, is_moderated=True, owner=self.user
        )

    def get_context(self, venue_id):
        """Імітуємо View context, бо серіалізатор бере venue_pk з view.kwargs"""
        request = self.factory.get('/')
        request.user = self.user

        class MockView:
            kwargs = {'venue_pk': venue_id}

        return {'request': request, 'view': MockView()}

    def test_valid_review_creation(self):
        """Тест валідного відгуку"""
        data = {'rating': 5, 'text': 'Great!'}
        context = self.get_context(self.venue.id)

        serializer = ReviewSerializer(data=data, context=context)
        self.assertTrue(serializer.is_valid())

    def test_duplicate_review_validation(self):
        """Не можна залишити два відгуки на один заклад"""
        # Створюємо перший відгук у базі
        ReviewModel.objects.create(author=self.user, venue=self.venue, rating=5)

        # Пробуємо створити другий через серіалізатор
        data = {'rating': 3, 'text': 'Changed my mind'}
        context = self.get_context(self.venue.id)

        serializer = ReviewSerializer(data=data, context=context)

        with self.assertRaises(ValidationError) as cm:
            serializer.is_valid(raise_exception=True)
        self.assertIn("You have already reviewed this venue", str(cm.exception))

    def test_missing_venue_in_context(self):
        """Якщо view не передав venue_pk (наприклад, помилка роутингу)"""
        data = {'rating': 5}
        # Передаємо None замість ID
        context = self.get_context(None)

        serializer = ReviewSerializer(data=data, context=context)

        with self.assertRaises(ValidationError) as cm:
            serializer.is_valid(raise_exception=True)
        self.assertIn("Venue not specified", str(cm.exception))