from django.test import TestCase
from django.test.client import RequestFactory

from apps.tag.models import TagModel, VenueTag
from apps.top.filter import TopVenueFilter
from apps.user.models import UserModel
from apps.venues.models import VenueModel


class TopFilterTests(TestCase):
    def setUp(self):
        self.user = UserModel.objects.create_user(email='filter@test.com', password='pass')

        # Тег
        self.tag = TagModel.objects.create(name="wifi")

        # 1. Заклад А: Кафе, Рейтинг 5, є WiFi
        self.venue_a = VenueModel.objects.create(
            title="Cafe A", category="cafe", rating=5.0,
            is_active=True, is_moderated=True, owner=self.user
        )
        VenueTag.objects.create(venue=self.venue_a, tag=self.tag)

        # 2. Заклад Б: Бар, Рейтинг 3, немає WiFi
        self.venue_b = VenueModel.objects.create(
            title="Bar B", category="bar", rating=3.0,
            is_active=True, is_moderated=True, owner=self.user
        )

        self.queryset = VenueModel.objects.all()

    def test_filter_by_category(self):
        """Фільтр category=cafe"""
        data = {'category': 'cafe'}
        f = TopVenueFilter(data, queryset=self.queryset)
        self.assertTrue(f.is_valid())
        self.assertEqual(f.qs.count(), 1)
        self.assertEqual(f.qs.first(), self.venue_a)

    def test_filter_by_min_rating(self):
        """Фільтр min_rating=4.0"""
        data = {'min_rating': 4.0}
        f = TopVenueFilter(data, queryset=self.queryset)
        self.assertEqual(f.qs.count(), 1)
        self.assertEqual(f.qs.first(), self.venue_a)

    def test_filter_by_tag(self):
        """Фільтр tag=wifi"""
        data = {'tag': ['wifi']}  # ManyToMany фільтр очікує список або мульти-параметр
        f = TopVenueFilter(data, queryset=self.queryset)

        # Примітка: ModelMultipleChoiceFilter іноді вимагає ID або name залежно від to_field_name
        # У вашому коді to_field_name='name', тому передаємо 'wifi'
        self.assertEqual(f.qs.count(), 1)
        self.assertEqual(f.qs.first(), self.venue_a)