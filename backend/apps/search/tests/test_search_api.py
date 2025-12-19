from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.user.models import UserModel
from apps.venues.models import VenueModel

# from apps.tag.models import TagModel  # Якщо потрібно створювати теги вручну

class GlobalSearchViewTests(APITestCase):
    def setUp(self):
        # 1. Створюємо власника
        self.owner = UserModel.objects.create_user(email='owner@test.com', password='password')

        # 2. Створюємо заклади для пошуку
        self.venue_coffee = VenueModel.objects.create(
            title="Best Coffee",
            description="Fresh beans and wifi",
            category="cafe",
            rating=5.0,
            views=100,
            is_active=True,
            is_moderated=True,
            owner=self.owner
        )

        self.venue_bar = VenueModel.objects.create(
            title="City Bar",
            description="Beer and terrace",
            category="bar",
            rating=4.0,
            views=50,
            is_active=True,
            is_moderated=True,
            owner=self.owner
        )

        # 3. Заклад, який НЕ має потрапити в пошук (неактивний)
        self.hidden_venue = VenueModel.objects.create(
            title="Secret Coffee",
            is_active=False,  # !
            is_moderated=True,
            owner=self.owner
        )

        # URL (name='global_search' з вашого urls.py)
        self.url = reverse('global_search')

    def test_search_by_title_match(self):
        """Пошук за назвою (Coffee)"""
        response = self.client.get(self.url, {'q': 'Coffee'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Best Coffee")

    def test_search_by_description_match(self):
        """Пошук за описом (wifi)"""
        response = self.client.get(self.url, {'q': 'wifi'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['id'], self.venue_coffee.id)

    def test_search_multiple_words_or_logic(self):
        """
        Ваш код використовує OR логіку (q_objects |= ...).
        Пошук 'Coffee Beer' має знайти І кав'ярню, І бар.
        """
        response = self.client.get(self.url, {'q': 'Coffee Beer'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)  # Знайшло обох

    def test_visibility_rules(self):
        """Неактивні або немодеровані заклади не повинні бути в пошуку"""
        # Шукаємо слово 'Secret', яке є в назві прихованого закладу
        response = self.client.get(self.url, {'q': 'Secret'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)  # Не знайшло нічого

    def test_default_ordering(self):
        """За замовчуванням сортування за rating, потім views"""
        # coffee (rating 5.0), bar (rating 4.0) -> Coffee перший
        response = self.client.get(self.url)  # без параметрів

        results = response.data['results']
        self.assertEqual(results[0]['title'], "Best Coffee")
        self.assertEqual(results[1]['title'], "City Bar")

    def test_search_no_results(self):
        """Пошук неіснуючого слова"""
        response = self.client.get(self.url, {'q': 'Unicorn'})
        self.assertEqual(response.data['count'], 0)