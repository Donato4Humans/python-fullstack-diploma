from unittest.mock import Mock

from django.test import TestCase

from ..permissions import IsAdminOrSuperUser, IsOwnerOrAdmin


class TagPermissionsTests(TestCase):
    def setUp(self):
        self.owner_permission = IsOwnerOrAdmin()
        self.admin_permission = IsAdminOrSuperUser()

        self.request = Mock()
        self.view = Mock()
        self.obj = Mock()

        # Юзери
        self.user = Mock()
        self.user.is_superuser = False

        self.admin = Mock()
        self.admin.is_superuser = True

        self.stranger = Mock()
        self.stranger.is_superuser = False

        # Налаштовуємо структуру obj.owner.user (для VenueTag або Venue)
        self.obj.owner.user = self.user

    def test_is_owner_or_admin_object_permission(self):
        """Перевірка IsOwnerOrAdmin (has_object_permission)"""
        # 1. Власник
        self.request.user = self.user
        self.assertTrue(self.owner_permission.has_object_permission(self.request, self.view, self.obj))

        # 2. Суперюзер
        self.request.user = self.admin
        self.assertTrue(self.owner_permission.has_object_permission(self.request, self.view, self.obj))

        # 3. Чужий
        self.request.user = self.stranger
        self.assertFalse(self.owner_permission.has_object_permission(self.request, self.view, self.obj))

    def test_is_admin_or_superuser_permission(self):
        """Перевірка IsAdminOrSuperUser (has_permission)"""
        # 1. Суперюзер
        self.request.user = self.admin
        self.assertTrue(self.admin_permission.has_permission(self.request, self.view))

        # 2. Звичайний юзер
        self.request.user = self.user
        self.assertFalse(self.admin_permission.has_permission(self.request, self.view))