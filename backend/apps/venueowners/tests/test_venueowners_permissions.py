from unittest.mock import Mock

from django.test import TestCase

from ..permissions import IsAdminOrSuperuser, IsOwnerOrAdmin


class VenueOwnerPermissionsTests(TestCase):
    def setUp(self):
        self.admin_perm = IsAdminOrSuperuser()
        self.owner_perm = IsOwnerOrAdmin()

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

        # Налаштовуємо об'єкт (власник закладу прив'язаний до юзера)
        self.obj.user = self.user

    def test_is_admin_or_superuser(self):
        """Тільки суперюзер має доступ"""
        # Суперюзер -> True
        self.request.user = self.admin
        self.assertTrue(self.admin_perm.has_permission(self.request, self.view))

        # Звичайний юзер -> False
        self.request.user = self.user
        self.assertFalse(self.admin_perm.has_permission(self.request, self.view))

    def test_is_owner_or_admin_object(self):
        """Власник або суперюзер мають доступ до об'єкта"""
        # 1. Власник (request.user == obj.user)
        self.request.user = self.user
        self.assertTrue(self.owner_perm.has_object_permission(self.request, self.view, self.obj))

        # 2. Суперюзер
        self.request.user = self.admin
        self.assertTrue(self.owner_perm.has_object_permission(self.request, self.view, self.obj))

        # 3. Чужий
        self.request.user = self.stranger
        self.assertFalse(self.owner_perm.has_object_permission(self.request, self.view, self.obj))