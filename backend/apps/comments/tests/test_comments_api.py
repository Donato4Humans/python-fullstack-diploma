from unittest.mock import patch

from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.comments.models import CommentModel
from apps.user.models import ProfileModel, UserModel
from apps.venues.models import VenueModel


class CommentViewsTests(APITestCase):
    def setUp(self):
        # 1. Юзери
        self.admin = UserModel.objects.create_user(email='admin@test.com', password='pass', is_superuser=True)
        ProfileModel.objects.create(user=self.admin, name="Admin")

        self.user = UserModel.objects.create_user(email='user@test.com', password='pass')
        ProfileModel.objects.create(user=self.user, name="User")

        # 2. Заклад (активний)
        self.venue = VenueModel.objects.create(
            title="Pub", is_active=True, is_moderated=True
        )

        # 3. Коментар (вже існуючий)
        self.comment = CommentModel.objects.create(
            author=self.user, venue=self.venue, text="Old comment", is_moderated=True
        )

        # URL names from YOUR urls.py
        self.list_create_url = reverse('comments_by_venue_list_create', kwargs={'venue_pk': self.venue.id})
        self.my_comments_url = reverse('user_comments')
        self.detail_url = reverse('comment_detail', kwargs={'pk': self.comment.id})
        self.blocked_url = reverse('blocked_comments')

    @patch('apps.comments.views.contains_forbidden_word')
    def test_create_comment_clean(self, mock_check):
        """Створення чистого коментаря (is_moderated=True)"""
        mock_check.return_value = False  # Слів немає

        self.client.force_authenticate(user=self.user)
        data = {'text': 'Nice place!'}

        response = self.client.post(self.list_create_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['is_moderated'])
        self.assertEqual(response.data['text'], 'Nice place!')

    @patch('apps.comments.views.contains_forbidden_word')
    def test_create_comment_dirty(self, mock_check):
        """Створення коментаря з матюками (is_moderated=False)"""
        mock_check.return_value = True  # Слова Є

        self.client.force_authenticate(user=self.user)
        data = {'text': 'Bad word!'}

        response = self.client.post(self.list_create_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(response.data['is_moderated'])  # Має бути False

    def test_list_venue_comments(self):
        """Отримання коментарів закладу (тільки модерація ОК)"""
        # Додамо прихований коментар
        CommentModel.objects.create(author=self.user, venue=self.venue, text="Hidden", is_moderated=False)

        response = self.client.get(self.list_create_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Тільки self.comment ("Old comment")
        self.assertEqual(response.data[0]['text'], "Old comment")

    def test_my_comments_list(self):
        """Список моїх коментарів"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.my_comments_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['text'], "Old comment")

    def test_delete_comment_owner(self):
        """Власник видаляє свій коментар"""
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(CommentModel.objects.filter(pk=self.comment.id).exists())

    def test_blocked_comments_admin_only(self):
        """Список заблокованих коментарів (тільки адмін)"""
        # Звичайний юзер -> 403
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.blocked_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Адмін -> 200
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.blocked_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)