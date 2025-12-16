# apps/favorites/models.py

from django.core.exceptions import ValidationError
from django.db import models

from core.models import BaseModel

from apps.user.models import UserModel
from apps.venues.models import VenueModel


class FavoriteModel(BaseModel):
    """
        User favorites (saved/bookmarked venues)
    """
    class Meta:
        db_table = 'favorites'
        ordering = ['-created_at']
        unique_together = ('user', 'venue')  # one favorite per user per venue

    user = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name='favorites'
    )
    venue = models.ForeignKey(
        VenueModel,
        on_delete=models.CASCADE,
        related_name='favorited_by'
    )

    def __str__(self):
        return f"{self.user.profile.name} ❤️ {self.venue.title}"

    def clean(self):
        # Only active and moderated venues can be favorited
        if not self.venue.is_active or not self.venue.is_moderated:
            raise ValidationError("Cannot favorite inactive or unmoderated venue.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)