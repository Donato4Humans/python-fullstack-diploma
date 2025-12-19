from unittest.mock import Mock

from django.test import TestCase

from ..permissions import IsAdminOrSuperUser, IsOwnerOrAdmin


class PiyachokPermissionsTests(TestCase):
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

        # Налаштовуємо об'єкт (імітуємо, що у нього є owner)
        # Увага: Якщо ви використовуєте цей пермішн для PiyachokRequest,
        # то у моделі має бути поле 'owner', або змініть код пермішена на 'requester'
        self.obj.owner.user = self.user

    def test_is_owner_access(self):
        """Власник об'єкта має доступ"""
        self.request.user = self.user
        self.assertTrue(self.owner_permission.has_object_permission(self.request, self.view, self.obj))

    def test_superuser_access_object(self):
        """Суперюзер має доступ до об'єкта"""
        self.request.user = self.admin
        self.assertTrue(self.owner_permission.has_object_permission(self.request, self.view, self.obj))

    def test_stranger_no_access_object(self):
        """Чужий юзер не має доступу"""
        self.request.user = self.stranger
        self.assertFalse(self.owner_permission.has_object_permission(self.request, self.view, self.obj))

    def test_admin_permission_global(self):
        """IsAdminOrSuperUser: Тільки адмін має доступ"""
        # Адмін - True
        self.request.user = self.admin
        self.assertTrue(self.admin_permission.has_permission(self.request, self.view))

        # Звичайний - False
        self.request.user = self.user
        self.assertFalse(self.admin_permission.has_permission(self.request, self.view))