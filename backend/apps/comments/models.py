
from django.db import models

from core.models import BaseModel

from apps.user.models import UserModel
from apps.venues.models import VenueModel


class CommentModel(BaseModel):
    """
        User comments under venues
    """
    class Meta:
        db_table = 'comments'
        ordering = ['-created_at']

    venue = models.ForeignKey(
        VenueModel,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    text = models.TextField()
    is_moderated = models.BooleanField(
        default=False,
        help_text="False = hidden until admin approves"
    )

    def __str__(self):
        return f"{self.author.profile.name} on {self.venue.title}: {self.text[:50]}"

    def delete(self, *args, **kwargs):
        # add photo cleanup if add photos later
        super().delete(*args, **kwargs)