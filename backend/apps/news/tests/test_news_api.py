from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.news.models import NewsModel
from apps.user.models import UserModel
from apps.venues.models import VenueModel


class NewsViewsTests(APITestCase):
    def setUp(self):
        # 1. Юзер та Адмін
        self.user = UserModel.objects.create_user(email='user@test.com', password='pass')
        self.admin = UserModel.objects.create_user(email='admin@test.com', password='pass', is_superuser=True)

        # 2. Заклад
        self.venue = VenueModel.objects.create(
            title="Venue 1", is_active=True, is_moderated=True, owner=self.user
        )

        # 3. Новини
        self.venue_news = NewsModel.objects.create(
            title="Venue News", venue=self.venue, content="Content"
        )
        self.global_news = NewsModel.objects.create(
            title="Global News", venue=None, content="Global Content"
        )

        # 4. URL Names (Оновлено згідно вашого urls.py)
        # path('', ..., name='news_list_create')
        self.list_url = reverse('news_list_create')

        # path('/global', ..., name='global_news')
        self.global_list_url = reverse('global_news')

        # path('/venue/<int:venue_pk>', ..., name='venue_news')
        self.venue_list_url = reverse('venue_news', kwargs={'venue_pk': self.venue.id})

        # path('/<int:pk>', ..., name='news_detail')
        self.detail_url = reverse('news_detail', kwargs={'pk': self.venue_news.id})

    def test_get_all_news(self):
        """Отримання всіх новин (і глобальних, і локальних)"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Має бути 2 новини
        self.assertEqual(len(response.data), 2)

    def test_get_global_news_only(self):
        """Endpoint 'global_news' повертає тільки ті, де venue=None"""
        response = self.client.get(self.global_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Global News")

    def test_get_venue_news_only(self):
        """Endpoint 'venue_news' повертає тільки новини конкретного закладу"""
        response = self.client.get(self.venue_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Venue News")

    def test_create_news_owner(self):
        """Власник створює новину в своєму закладі"""
        self.client.force_authenticate(user=self.user)
        data = {
            'title': 'New Event',
            'venue_id': self.venue.id,
            'content': 'Welcome'
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Event')

    def test_delete_news_owner(self):
        """Власник видаляє свою новину"""
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.detail_url)

        # Ваша вюха повертає 200 OK з повідомленням
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(NewsModel.objects.filter(pk=self.venue_news.id).exists())

    def test_delete_news_stranger_forbidden(self):
        """Чужий юзер не може видалити новину"""
        other_user = UserModel.objects.create_user(email='other@test.com', password='pass')
        self.client.force_authenticate(user=other_user)

        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)