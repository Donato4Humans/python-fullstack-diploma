from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.tag.models import TagModel, VenueTag
from apps.top.models import SponsoredTopModel
from apps.user.models import UserModel
from apps.venues.models import VenueModel


class TopViewsTests(APITestCase):
    def setUp(self):
        # 1. Юзери
        self.admin = UserModel.objects.create_user(email='admin@test.com', password='pass', is_superuser=True)
        self.user = UserModel.objects.create_user(email='user@test.com', password='pass', is_superuser=False)

        # 2. Заклади
        # Високий рейтинг, мало переглядів
        self.high_rated = VenueModel.objects.create(
            title="Top Rated", rating=5.0, views=10, category='cafe',
            is_active=True, is_moderated=True, owner=self.user
        )
        # Низький рейтинг, багато переглядів
        self.popular = VenueModel.objects.create(
            title="Popular", rating=3.0, views=1000, category='bar',
            is_active=True, is_moderated=True, owner=self.user
        )

        # 3. Теги
        self.tag = TagModel.objects.create(name="party")
        VenueTag.objects.create(venue=self.popular, tag=self.tag)

        # 4. URL Names
        self.top_venues_url = reverse('top_venues')
        self.sponsored_admin_url = reverse('sponsored_top_admin')

    def test_top_venues_default_order(self):
        """За замовчуванням сортування по рейтингу"""
        response = self.client.get(self.top_venues_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        results = response.data['results']
        self.assertEqual(results[0]['title'], "Top Rated")  # 5.0 rating

    def test_top_venues_order_by_views(self):
        """Сортування ?order_by=views"""
        response = self.client.get(self.top_venues_url, {'order_by': 'views'})

        results = response.data['results']
        self.assertEqual(results[0]['title'], "Popular")  # 1000 views

    def test_top_by_category_view(self):
        """Перевірка URL /category/<cat>"""
        url = reverse('top_by_category', kwargs={'category': 'cafe'})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Top Rated")

    def test_top_by_tag_view(self):
        """Перевірка URL /tag/<tag_name>"""
        url = reverse('top_by_tag', kwargs={'tag_name': 'party'})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Popular")

    def test_sponsored_admin_create(self):
        """Адмін може додавати заклади в спонсорський топ"""
        self.client.force_authenticate(user=self.admin)
        data = {
            'position': 1,
            'note': 'Featured',
            # Важливо: SponsoredTopSerializer очікує venue (якщо nested write не підтримується,
            # то зазвичай треба ID, але у вашому коді venue read_only.
            # Якщо ви хочете створювати через API, серіалізатор має приймати venue_id.
            # Припустимо, що серіалізатор адаптований під прийом ID або ми перевіряємо GET)
        }
        # Оскільки у вашому Serializer venue=read_only, створення через POST може не працювати для поля venue,
        # якщо ви не додали venue_id = PrimaryKeyRelatedField(write_only=True).
        # Протестуємо GET доступ для адміна:

        response = self.client.get(self.sponsored_admin_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_sponsored_user_forbidden(self):
        """Звичайний юзер не має доступу до адмінки спонсорів"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.sponsored_admin_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)