from django.test import TestCase

from apps.auth.serializers import EmailSerializer, PasswordSerializer, UserRoleSerializer
from apps.user.models import UserModel


class UserSerializersTest(TestCase):
    def setUp(self):
        self.user = UserModel.objects.create_user(
            email='testemail@example.com',
            password='TestPassword123'
        )

    def test_email_serializer_valid(self):
        data = {'email': 'valid@example.com'}
        serializer = EmailSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['email'], data['email'])

    def test_email_serializer_invalid(self):
        data = {'email': 'invalid-email'}
        serializer = EmailSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    def test_password_serializer_valid(self):
        data = {'password': 'NewTestPassword123'}
        serializer = PasswordSerializer(instance=self.user, data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['password'], data['password'])

    def test_password_serializer_invalid_missing_password(self):
        data = {}
        serializer = PasswordSerializer(instance=self.user, data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)

    def test_user_role_serializer_valid(self):
        data = {
            'is_superuser': True,
            'is_user': False,
            'is_owner': True,
            'is_critic': False
        }
        serializer = UserRoleSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['is_superuser'], data['is_superuser'])
        self.assertEqual(serializer.validated_data['is_user'], data['is_user'])
        self.assertEqual(serializer.validated_data['is_owner'], data['is_owner'])
        self.assertEqual(serializer.validated_data['is_critic'], data['is_critic'])

    def test_user_role_serializer_invalid_missing_fields(self):
        data = {
            'is_superuser': True,
            'is_user': False
        }
        serializer = UserRoleSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('is_owner', serializer.errors)
        self.assertIn('is_critic', serializer.errors)