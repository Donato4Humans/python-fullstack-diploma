from unittest.mock import patch

from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.user.models import ProfileModel, UserModel
from apps.venueowners.models import VenueOwnerModel
from apps.venues.models import VenueModel


class VenueViewsTests(APITestCase):
    def setUp(self):
        # 1. Юзери
        self.admin = UserModel.objects.create_user(email='admin@test.com', password='pass', is_superuser=True)
        ProfileModel.objects.create(user=self.admin, name="Admin")

        self.user = UserModel.objects.create_user(email='user@test.com', password='pass')
        ProfileModel.objects.create(user=self.user, name="User")

        # 2. Власник
        self.owner = VenueOwnerModel.objects.create(user=self.user, is_active=True)

        # 3. Заклад
        self.venue = VenueModel.objects.create(
            owner=self.owner, title="Old Venue", average_check=100, is_active=True, is_moderated=True
        )

        self.list_url = reverse('venue_list')
        self.detail_url = reverse('venue_detail', kwargs={'pk': self.venue.id})
        self.transfer_url = reverse('venue_transfer', kwargs={'pk': self.venue.id})
        self.inactive_url = reverse('venue_inactive')

    @patch('apps.venues.views.send_venue_added_email_task.delay')
    @patch('apps.venues.views.contains_forbidden_word')
    def test_create_venue_success(self, mock_words, mock_email):
        """Успішне створення закладу"""
        mock_words.return_value = False  # Слів немає

        self.client.force_authenticate(user=self.user)
        data = {
            'title': 'New Bar',
            'average_check': 300,
            'schedule': '10-22',
            'description': 'Cool place'
        }

        response = self.client.post(self.list_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(VenueModel.objects.filter(title='New Bar').exists())
        mock_email.assert_called_once()

    @patch('apps.venues.views.send_blocked_venue_banned_words_email_task.delay')
    @patch('apps.venues.views.contains_forbidden_word')
    def test_create_venue_forbidden_words(self, mock_words, mock_email):
        """Спроба створити заклад із забороненими словами"""
        mock_words.return_value = True  # Слова Є

        self.client.force_authenticate(user=self.user)
        data = {'title': 'Bad Word Bar', 'average_check': 300}

        # При першій спробі - ValidationError (залишилось спроб)
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Venue contains forbidden words", str(response.data))

    @patch('apps.venues.views.update_venue_views')
    def test_retrieve_venue_increments_views(self, mock_update_views):
        """Перегляд закладу викликає сервіс оновлення переглядів"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_update_views.assert_called_once_with(self.venue)

    def test_transfer_ownership(self):
        """Адмін передає заклад іншому власнику"""
        new_user = UserModel.objects.create_user(email='new@test.com', password='p')
        new_owner = VenueOwnerModel.objects.create(user=new_user)

        self.client.force_authenticate(user=self.admin)
        data = {'new_owner_id': new_owner.id}

        response = self.client.patch(self.transfer_url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.venue.refresh_from_db()
        self.assertEqual(self.venue.owner, new_owner)

    def test_inactive_list_admin_only(self):
        """Тільки адмін бачить список неактивних закладів"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.inactive_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.inactive_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)