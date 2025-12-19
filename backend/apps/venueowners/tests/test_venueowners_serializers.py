from django.test import TestCase

from rest_framework.test import APIRequestFactory

from apps.user.models import ProfileModel, UserModel
from apps.venueowners.models import VenueOwnerModel
from apps.venueowners.serializers import OwnerSerializer


class OwnerSerializerTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = UserModel.objects.create_user(email='test@test.com', password='pass')
        # Створюємо профіль, якщо він потрібен для логіки
        ProfileModel.objects.create(user=self.user, name="Tester")

    def get_context(self):
        request = self.factory.post('/')
        request.user = self.user
        return {'request': request}

    def test_create_owner_serializer(self):
        """Тест створення власника через серіалізатор"""
        # Дані можуть бути пустими, бо user береться з request, а інші поля read_only або необов'язкові
        data = {}

        serializer = OwnerSerializer(data=data, context=self.get_context())
        self.assertTrue(serializer.is_valid())

        owner = serializer.save()

        self.assertEqual(owner.user, self.user)
        self.assertTrue(VenueOwnerModel.objects.filter(user=self.user).exists())

    def test_read_only_fields(self):
        """Перевірка, що поле user не можна перезаписати"""
        other_user = UserModel.objects.create_user(email='hacker@test.com', password='pass')

        # Спробуємо передати іншого юзера в data
        data = {'user': other_user.id}

        serializer = OwnerSerializer(data=data, context=self.get_context())
        self.assertTrue(serializer.is_valid())
        owner = serializer.save()

        # Серіалізатор має ігнорувати поле user з data і брати self.user з контексту
        self.assertEqual(owner.user, self.user)
        self.assertNotEqual(owner.user, other_user)