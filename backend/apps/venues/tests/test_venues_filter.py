from django.test import TestCase

from apps.user.models import UserModel
from apps.venueowners.models import VenueOwnerModel
from apps.venues.filter import VenueFilter
from apps.venues.models import VenueModel


class VenueFilterTests(TestCase):
    def setUp(self):
        user = UserModel.objects.create_user(email='f@test.com', password='p')
        owner = VenueOwnerModel.objects.create(user=user)

        # Заклад 1: Рейтинг 5, Чек 100, Київ
        self.v1 = VenueModel.objects.create(
            owner=owner, title="A", rating=5.0, average_check=100, city="Kyiv"
        )
        # Заклад 2: Рейтинг 3, Чек 500, Львів
        self.v2 = VenueModel.objects.create(
            owner=owner, title="B", rating=3.0, average_check=500, city="Lviv"
        )

        self.queryset = VenueModel.objects.all()

    def test_lt_rating(self):
        """Рейтинг < 4"""
        f = VenueFilter({'lt_rating': 4}, queryset=self.queryset)
        self.assertEqual(f.qs.count(), 1)
        self.assertEqual(f.qs.first(), self.v2)

    def test_gt_average_check(self):
        """Чек > 200"""
        f = VenueFilter({'gt_average_check': 200}, queryset=self.queryset)
        self.assertEqual(f.qs.count(), 1)
        self.assertEqual(f.qs.first(), self.v2)

    def test_icontains_city(self):
        """Місто містить 'kyiv'"""
        f = VenueFilter({'icontains_city': 'kyiv'}, queryset=self.queryset)
        self.assertEqual(f.qs.count(), 1)
        self.assertEqual(f.qs.first(), self.v1)

    def test_range_average_check(self):
        """Чек в діапазоні 50-150"""
        # range filter зазвичай приймає min,max через кому або два параметри
        # У DRF RangeFilter часто працює як ?range_average_check_min=...&_max=...
        # Але передача через словник у тесті залежить від конфігурації.
        # Спробуємо стандартний django-filter lookup suffix
        f = VenueFilter({'average_check_min': 50, 'average_check_max': 150}, queryset=self.queryset)
        self.assertEqual(f.qs.count(), 1)
        self.assertEqual(f.qs.first(), self.v1)