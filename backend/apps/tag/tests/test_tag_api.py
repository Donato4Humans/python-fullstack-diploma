from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.tag.models import TagModel, VenueTag
from apps.user.models import ProfileModel, UserModel
from apps.venues.models import VenueModel


class TagViewsTests(APITestCase):
    def setUp(self):
        # 1. Юзери
        self.admin = UserModel.objects.create_user(email='admin@test.com', password='pass', is_superuser=True)
        self.user = UserModel.objects.create_user(email='user@test.com', password='pass', is_superuser=False)
        self.other_user = UserModel.objects.create_user(email='other@test.com', password='pass')

        ProfileModel.objects.create(user=self.admin, name="Admin")
        ProfileModel.objects.create(user=self.user, name="User")

        # 2. Теги
        self.tag_wifi = TagModel.objects.create(name="WiFi")
        self.tag_beer = TagModel.objects.create(name="Beer")

        # 3. Заклад (належить звичайному юзеру)
        self.venue = VenueModel.objects.create(
            title="My Place", is_active=True, is_moderated=True, owner=self.user
        )

        # URL names from urls.py
        self.list_create_url = reverse('tag_list_create')
        self.tag_detail_url = reverse('tag_detail', kwargs={'pk': self.tag_wifi.id})
        self.venue_tags_url = reverse('venue_tags', kwargs={'venue_pk': self.venue.id})

    # --- ТЕСТИ ГЛОБАЛЬНИХ ТЕГІВ ---

    def test_list_tags_public(self):
        """Список тегів доступний всім (AllowAny)"""
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_tag_admin(self):
        """Адмін може створити новий тег"""
        self.client.force_authenticate(user=self.admin)
        data = {'name': 'NewTag'}

        response = self.client.post(self.list_create_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(TagModel.objects.filter(name='NewTag').exists())

    def test_create_tag_user_forbidden(self):
        """Звичайний юзер НЕ може створити тег"""
        self.client.force_authenticate(user=self.user)
        data = {'name': 'HackerTag'}

        response = self.client.post(self.list_create_url, data)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_tag_admin(self):
        """Адмін може видалити тег"""
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.tag_detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # --- ТЕСТИ VENUE TAGS ---

    def test_add_tag_to_venue_owner(self):
        """Власник додає тег до свого закладу"""
        self.client.force_authenticate(user=self.user)
        data = {'tag_id': self.tag_wifi.id}

        response = self.client.post(self.venue_tags_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Перевірка бази
        self.assertTrue(VenueTag.objects.filter(venue=self.venue, tag=self.tag_wifi).exists())

    def test_add_tag_to_venue_stranger_fail(self):
        """Чужий юзер не може додати тег до чужого закладу"""
        self.client.force_authenticate(user=self.other_user)
        data = {'tag_id': self.tag_beer.id}

        response = self.client.post(self.venue_tags_url, data)

        # Ваша вюха викидає ValidationError в perform_create, це 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("You can only manage tags for your own venue", str(response.data))

    def test_list_venue_tags(self):
        """Отримання списку тегів конкретного закладу"""
        # Створимо зв'язок у базі
        VenueTag.objects.create(venue=self.venue, tag=self.tag_beer)

        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.venue_tags_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['tag']['name'], "Beer")