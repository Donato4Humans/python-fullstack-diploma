from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.favorite.models import FavoriteModel
from apps.user.models import ProfileModel, UserModel
from apps.venues.models import VenueModel


class FavoriteViewsTests(APITestCase):
    def setUp(self):
        # 1. Юзери
        self.user = UserModel.objects.create_user(email='me@test.com', password='password')
        self.other_user = UserModel.objects.create_user(email='other@test.com', password='password')

        ProfileModel.objects.create(user=self.user, name="Me")
        ProfileModel.objects.create(user=self.other_user, name="Other")

        # 2. Заклад
        self.venue = VenueModel.objects.create(
            title="Top Bar", is_active=True, is_moderated=True, owner=self.other_user
        )

        # 3. URL-адреси (Згідно вашого urls.py)
        self.list_create_url = reverse('favorite_list_create')
        # detail_url визначимо пізніше, коли створимо об'єкт

    def test_add_favorite(self):
        """Тест додавання закладу в обране (POST)"""
        self.client.force_authenticate(user=self.user)
        data = {'venue_id': self.venue.id}

        response = self.client.post(self.list_create_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(FavoriteModel.objects.filter(user=self.user, venue=self.venue).exists())

    def test_list_favorites(self):
        """Тест отримання списку (GET). Бачить тільки свої."""
        # Моє обране
        FavoriteModel.objects.create(user=self.user, venue=self.venue)
        # Чуже обране (інший заклад)
        venue2 = VenueModel.objects.create(title="Other", is_active=True, is_moderated=True, owner=self.other_user)
        FavoriteModel.objects.create(user=self.other_user, venue=venue2)

        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.list_create_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['venue']['id'], self.venue.id)

    def test_delete_favorite_success(self):
        """Тест видалення з обраного (DELETE)"""
        fav = FavoriteModel.objects.create(user=self.user, venue=self.venue)

        # URL: name='favorite_delete'
        url = reverse('favorite_delete', kwargs={'pk': fav.id})

        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        # Перевіряємо статус (ваша вюха може повертати 200 або 204)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_204_NO_CONTENT])
        self.assertFalse(FavoriteModel.objects.filter(pk=fav.id).exists())

    def test_delete_others_favorite_fail(self):
        """Тест: не можна видалити чуже обране"""
        # Створюємо запис чужого юзера
        fav = FavoriteModel.objects.create(user=self.other_user, venue=self.venue)

        url = reverse('favorite_delete', kwargs={'pk': fav.id})

        # Логінимось як поточний user (не власник)
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        # API має повернути 404, бо get_queryset фільтрує по request.user,
        # тому юзер просто "не знайде" чужий ID.
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)