from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.tag.models import TagModel
from apps.user.models import UserModel
from apps.venues.models import VenueModel


class GlobalSearchFilterTests(APITestCase):
    def setUp(self):
        self.owner = UserModel.objects.create_user(email='filter@test.com', password='password')

        # Створюємо теги
        self.tag_wifi = TagModel.objects.create(name="wifi")
        self.tag_terrace = TagModel.objects.create(name="terrace")

        # 1. Дорогий ресторан (rating 4.5, check 1000) + Tag Terrace
        self.luxury_venue = VenueModel.objects.create(
            title="Luxury Place",
            category="restaurant",
            average_check=1000,
            rating=4.5,
            is_active=True, is_moderated=True, owner=self.owner
        )
        # Додаємо тег (адаптуйте цей рядок під вашу структуру зв'язку)
        # Варіант А (якщо ManyToMany): self.luxury_venue.tags.add(self.tag_terrace)
        # Варіант Б (якщо проміжна модель і related_name='venue_tags'):
        self.luxury_venue.venue_tags.create(tag=self.tag_terrace)

        # 2. Дешевий бар (rating 3.0, check 200) + Tag Wifi
        self.cheap_venue = VenueModel.objects.create(
            title="Cheap Bar",
            category="bar",
            average_check=200,
            rating=3.0,
            is_active=True, is_moderated=True, owner=self.owner
        )
        self.cheap_venue.venue_tags.create(tag=self.tag_wifi)

        self.url = reverse('global_search')

    def test_filter_by_category(self):
        """Фільтр ?category=bar"""
        response = self.client.get(self.url, {'category': 'bar'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Cheap Bar")

    def test_filter_by_price_range(self):
        """Фільтр ?min_price=500"""
        response = self.client.get(self.url, {'min_price': 500})

        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Luxury Place")

    def test_filter_by_rating_range(self):
        """Фільтр ?min_rating=4.0"""
        response = self.client.get(self.url, {'min_rating': 4.0})

        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Luxury Place")

    def test_filter_by_tag(self):
        """Фільтр ?tag=wifi"""
        response = self.client.get(self.url, {'tag': 'wifi'})

        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Cheap Bar")

    def test_combined_filters(self):
        """Комбінація: category=bar AND max_price=300"""
        response = self.client.get(self.url, {
            'category': 'bar',
            'max_price': 300
        })

        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Cheap Bar")

    def test_ordering_by_price_asc(self):
        """Сортування ?order_by=average_check (від дешевих до дорогих)"""
        response = self.client.get(self.url, {'order_by': 'average_check'})

        results = response.data['results']
        # Cheap (200) має бути першим, Luxury (1000) другим
        self.assertEqual(results[0]['title'], "Cheap Bar")
        self.assertEqual(results[1]['title'], "Luxury Place")