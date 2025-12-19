from unittest.mock import Mock

from django.test import TestCase

from ..permissions import IsNewsAuthorOrAdmin


class NewsPermissionsTests(TestCase):
    def setUp(self):
        self.permission = IsNewsAuthorOrAdmin()
        self.request = Mock()
        self.view = Mock()
        self.obj = Mock()  # Об'єкт новини

        self.user = Mock()
        self.user.is_superuser = False
        self.user.is_critic = False

        self.request.user = self.user

    def test_superuser_access(self):
        """Суперюзер має повний доступ"""
        self.user.is_superuser = True
        self.assertTrue(self.permission.has_object_permission(self.request, self.view, self.obj))

    def test_critic_access(self):
        """Критик має повний доступ"""
        self.user.is_critic = True
        self.assertTrue(self.permission.has_object_permission(self.request, self.view, self.obj))

    def test_venue_owner_access(self):
        """Власник закладу має доступ до новин свого закладу"""
        # Налаштовуємо структуру: obj.venue.owner.user
        self.obj.venue.owner.user = self.user

        self.assertTrue(self.permission.has_object_permission(self.request, self.view, self.obj))

    def test_stranger_access_venue_news(self):
        """Чужий юзер не має доступу до новин чужого закладу"""
        other_user = Mock()
        self.obj.venue.owner.user = other_user  # Власник хтось інший

        self.assertFalse(self.permission.has_object_permission(self.request, self.view, self.obj))

    def test_global_news_access_regular_user(self):
        """Звичайний юзер не може редагувати глобальні новини (без закладу)"""
        self.obj.venue = None  # Глобальна новина
        self.assertFalse(self.permission.has_object_permission(self.request, self.view, self.obj))