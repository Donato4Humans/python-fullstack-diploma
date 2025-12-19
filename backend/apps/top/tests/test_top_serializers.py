from django.test import TestCase

from apps.top.models import SponsoredTopModel
from apps.top.serializers import SponsoredTopSerializer
from apps.user.models import UserModel
from apps.venues.models import VenueModel


class SponsoredTopSerializerTests(TestCase):
    def setUp(self):
        self.user = UserModel.objects.create_user(email='test@test.com', password='pass')
        self.venue = VenueModel.objects.create(
            title="Sponsor Venue", is_active=True, is_moderated=True, owner=self.user
        )
        self.sponsored = SponsoredTopModel.objects.create(
            venue=self.venue, position=1, note="Paid promo"
        )

    def test_serializer_structure(self):
        """Перевіряємо, що venue серіалізується як вкладений об'єкт (read-only), а не просто ID"""
        serializer = SponsoredTopSerializer(instance=self.sponsored)
        data = serializer.data

        self.assertEqual(data['position'], 1)
        self.assertEqual(data['note'], "Paid promo")

        # Перевіряємо вкладеність VenueSerializer
        self.assertTrue(isinstance(data['venue'], dict))
        self.assertEqual(data['venue']['title'], "Sponsor Venue")