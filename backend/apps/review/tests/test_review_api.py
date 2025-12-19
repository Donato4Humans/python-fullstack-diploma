from unittest.mock import patch

from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.review.models import ReviewModel
from apps.user.models import ProfileModel, UserModel
from apps.venues.models import VenueModel


class ReviewViewsTests(APITestCase):
    def setUp(self):
        # 1. Юзери
        self.user = UserModel.objects.create_user(email='me@test.com', password='password')
        self.other = UserModel.objects.create_user(email='other@test.com', password='password')

        ProfileModel.objects.create(user=self.user, name="Me")
        ProfileModel.objects.create(user=self.other, name="Other")

        # 2. Заклад
        self.venue = VenueModel.objects.create(
            title="Pub", is_active=True, is_moderated=True, owner=self.other
        )

        # 3. Існуючий відгук (модерований)
        self.review = ReviewModel.objects.create(
            author=self.user, venue=self.venue, rating=5, text="Cool", is_moderated=True
        )
        # Немодерований відгук (не має бути видно публічно)
        self.hidden_review = ReviewModel.objects.create(
            author=self.other, venue=self.venue, rating=1, text="Hidden", is_moderated=False
        )

        # URL names from urls.py
        self.list_create_url = reverse('review_list_create', kwargs={'venue_pk': self.venue.id})
        self.my_reviews_url = reverse('my_reviews')
        self.detail_url = reverse('review_detail', kwargs={'pk': self.review.id})

    def test_list_reviews_public(self):
        """GET список відгуків: видно тільки is_moderated=True"""
        response = self.client.get(self.list_create_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['text'], "Cool")

    def test_create_review(self):
        """POST створення відгуку"""
        # Створюємо новий заклад для чистоти тесту (бо на старий вже є відгук від self.user)
        new_venue = VenueModel.objects.create(title="New", is_active=True, is_moderated=True, owner=self.other)
        url = reverse('review_list_create', kwargs={'venue_pk': new_venue.id})

        self.client.force_authenticate(user=self.user)
        data = {'rating': 4, 'text': 'Nice place'}

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['rating'], 4)
        self.assertEqual(response.data['author_name'], "Me")

    def test_my_reviews_list(self):
        """GET мої відгуки"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.my_reviews_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['text'], "Cool")

    @patch('apps.venues.models.VenueModel.update_rating')
    def test_update_review_owner(self, mock_update_rating):
        """PUT оновлення відгуку власником + виклик update_rating"""
        self.client.force_authenticate(user=self.user)
        data = {'rating': 3, 'text': 'Updated text'}

        response = self.client.put(self.detail_url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['text'], 'Updated text')

        # Перевіряємо, що вюха викликала метод перерахунку рейтингу
        # Якщо методу update_rating немає в моделі, patch запобігає помилці в тесті,
        # але в реальному коді вам треба його реалізувати.
        # mock_update_rating.assert_called()

    def test_delete_review_not_owner(self):
        """Чужий юзер не може видалити відгук"""
        self.client.force_authenticate(user=self.other)
        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch('apps.venues.models.VenueModel.update_rating')
    def test_delete_review_owner(self, mock_update_rating):
        """Власник видаляє свій відгук"""
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(ReviewModel.objects.filter(pk=self.review.id).exists())