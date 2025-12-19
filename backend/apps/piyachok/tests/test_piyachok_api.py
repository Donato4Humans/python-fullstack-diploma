from unittest.mock import patch

from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.piyachok.models import MatchModel, PiyachokRequestModel
from apps.user.models import ProfileModel, UserModel
from apps.venues.models import VenueModel


class PiyachokViewsTests(APITestCase):
    def setUp(self):
        # 1. Юзери
        self.user = UserModel.objects.create_user(email='me@test.com', password='password')
        self.other_user = UserModel.objects.create_user(email='other@test.com', password='password')
        self.admin = UserModel.objects.create_user(email='admin@test.com', password='password', is_superuser=True)

        ProfileModel.objects.create(user=self.user, name="Me")
        ProfileModel.objects.create(user=self.other_user, name="Other")

        # 2. Заклад
        self.venue = VenueModel.objects.create(
            title="Pub", is_active=True, is_moderated=True, owner=self.admin
        )

        # 3. Заявка від іншого юзера (для тесту Join)
        self.other_request = PiyachokRequestModel.objects.create(
            requester=self.other_user,
            status='pending',
            budget=200,
            who_pays='split',
            preferred_venue=self.venue
        )

        # URL names from urls.py
        self.list_create_url = reverse('all_piyachok_requests')
        self.active_list_url = reverse('all_active_requests')
        self.join_url = reverse('join_request', kwargs={'pk': self.other_request.id})
        self.run_matching_url = reverse('run_matching_test')
        # Для accept_url нам потрібен створений матч, зробимо це в самому тесті

    def test_create_request(self):
        """Створення заявки"""
        self.client.force_authenticate(user=self.user)
        data = {
            'budget': 500,
            'who_pays': 'me',
            'preferred_venue_id': self.venue.id
        }
        response = self.client.post(self.list_create_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['requester'], self.user.id)
        self.assertEqual(response.data['status'], 'pending')

    def test_list_my_requests(self):
        """Список тільки моїх заявок"""
        # Створюємо мою заявку
        PiyachokRequestModel.objects.create(requester=self.user, budget=100, who_pays='me')

        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.list_create_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Бачимо тільки свою, other_request не бачимо тут

    def test_join_request_success(self):
        """Успішне приєднання до чужої заявки (створення матчу)"""
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.join_url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("chat_room", response.data)

        # Перевіряємо, що статус заявки змінився
        self.other_request.refresh_from_db()
        self.assertEqual(self.other_request.status, 'matched')

        # Перевіряємо, що матч створено
        self.assertTrue(MatchModel.objects.filter(request1=self.other_request).exists())

    def test_join_own_request_fail(self):
        """Не можна приєднатися до своєї заявки"""
        my_req = PiyachokRequestModel.objects.create(requester=self.user, budget=100, who_pays='me')
        url = reverse('join_request', kwargs={'pk': my_req.id})

        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_match_accept(self):
        """Прийняття матчу (генерація чату)"""
        # Створюємо матч
        my_req = PiyachokRequestModel.objects.create(requester=self.user, budget=100, who_pays='me')
        match = MatchModel.objects.create(request1=my_req, request2=None, is_accepted=False)

        url = reverse('match_accept', kwargs={'pk': match.id})

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        match.refresh_from_db()
        self.assertTrue(match.is_accepted)
        self.assertIsNotNone(match.chat_room_id)

    @patch('core.tasks.piyachok_match_task.find_matches_task.delay')
    def test_run_matching_admin(self, mock_task):
        """Адмін запускає таску на пошук пар"""
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.run_matching_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_task.assert_called_once()

    def test_run_matching_user_forbidden(self):
        """Звичайний юзер не може запускати матчінг"""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.run_matching_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)