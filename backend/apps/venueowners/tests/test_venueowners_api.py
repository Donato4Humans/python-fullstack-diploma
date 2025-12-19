from unittest.mock import patch

from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.user.models import ProfileModel, UserModel
from apps.venueowners.models import VenueOwnerModel


class VenueOwnerViewsTests(APITestCase):
    def setUp(self):
        # 1. Адмін
        self.admin = UserModel.objects.create_user(email='admin@test.com', password='pass', is_superuser=True)
        ProfileModel.objects.create(user=self.admin, name="Admin")

        # 2. Звичайний юзер
        self.user = UserModel.objects.create_user(email='user@test.com', password='pass')
        ProfileModel.objects.create(user=self.user, name="User")

        # 3. Існуючий власник
        self.owner_user = UserModel.objects.create_user(email='owner@test.com', password='pass')
        ProfileModel.objects.create(user=self.owner_user, name="OwnerGuy")
        self.venue_owner = VenueOwnerModel.objects.create(user=self.owner_user, is_active=True)

        # URL Names
        self.list_create_url = reverse('owners_list')
        self.detail_url = reverse('owners_detail', kwargs={'pk': self.venue_owner.id})

    def test_list_owners_permission(self):
        """GET список доступний тільки адміну"""
        # Звичайний юзер -> 403
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Адмін -> 200
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('apps.venueowners.views.send_owner_create_email_task.delay')
    def test_create_owner_success(self, mock_email_task):
        """Успішне створення власника"""
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.list_create_url, {})

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(VenueOwnerModel.objects.filter(user=self.user).exists())
        mock_email_task.assert_called_once_with(self.user.email, "User")

    def test_create_owner_duplicate_fail(self):
        """Помилка, якщо юзер вже є власником"""
        # Логінимось як юзер, який вже є власником (self.owner_user)
        self.client.force_authenticate(user=self.owner_user)

        response = self.client.post(self.list_create_url, {})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Перевірка тексту помилки з validationError
        self.assertIn("You are already a venue owner!", str(response.data))

    def test_retrieve_owner_permission(self):
        """Деталі власника бачить тільки він сам або адмін"""
        # Чужий юзер -> 403
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Власник -> 200
        self.client.force_authenticate(user=self.owner_user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('apps.venueowners.views.send_owner_deleted_email_task.delay')
    def test_delete_owner(self, mock_del_task):
        """Видалення власника"""
        self.client.force_authenticate(user=self.owner_user)

        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(VenueOwnerModel.objects.filter(pk=self.venue_owner.id).exists())
        mock_del_task.assert_called_once()