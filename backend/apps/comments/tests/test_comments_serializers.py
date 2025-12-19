from django.test import TestCase

from rest_framework.exceptions import ValidationError
from rest_framework.test import APIRequestFactory

from apps.comments.serializers import CommentSerializer
from apps.user.models import ProfileModel, UserModel
from apps.venues.models import VenueModel


class CommentSerializerTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

        # Юзер
        self.user = UserModel.objects.create_user(email='test@test.com', password='pass')
        ProfileModel.objects.create(user=self.user, name="Tester")

        # Заклади
        self.active_venue = VenueModel.objects.create(
            title="Open Bar", is_active=True, is_moderated=True, owner=self.user.profile
            # або просто owner=self.user, залежно від моделі
        )
        # Для VenueModel owner зазвичай це VenueOwnerModel, але для тесту спростимо,
        # головне is_active/is_moderated

        self.inactive_venue = VenueModel.objects.create(
            title="Closed Bar", is_active=False, is_moderated=True
        )

    def get_context(self, venue_id):
        """Імітуємо View context з venue_pk"""
        request = self.factory.post('/')
        request.user = self.user

        class MockView:
            kwargs = {'venue_pk': venue_id}

        return {'request': request, 'view': MockView()}

    def test_valid_comment_serializer(self):
        """Успішна валідація"""
        data = {'text': 'Great place!'}
        context = self.get_context(self.active_venue.id)

        serializer = CommentSerializer(data=data, context=context)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['text'], 'Great place!')

    def test_comment_inactive_venue_fail(self):
        """Не можна коментувати неактивний заклад"""
        data = {'text': 'Why closed?'}
        context = self.get_context(self.inactive_venue.id)

        serializer = CommentSerializer(data=data, context=context)

        with self.assertRaises(ValidationError) as cm:
            serializer.is_valid(raise_exception=True)
        self.assertIn("Cannot comment on inactive venue", str(cm.exception))