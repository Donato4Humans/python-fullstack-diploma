
from django.core import validators as V
from django.db import models

from core.models import BaseModel

from apps.user.models import UserModel
from apps.venues.models import VenueModel


class ReviewModel(BaseModel):
    """
    User reviews for venues
    Critics get special badge (is_critic_review = True)
    """
    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
        unique_together = ('author', 'venue')  # one review per user per venue


    venue = models.ForeignKey(
        VenueModel,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    author = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.PositiveSmallIntegerField(
        validators=[V.MinValueValidator(1), V.MaxValueValidator(5)],
        help_text="Rating from 1 to 5"
    )
    text = models.TextField(
        blank=True,
        help_text="Optional review text"
    )
    is_critic_review = models.BooleanField(
        default=False,
        help_text="True if author was critic at time of writing"
    )

    def __str__(self):
        return f"{self.author.profile.name} — {self.venue.title} ({self.rating}/5)"



    def save(self, *args, **kwargs):
        # Auto-set critic badge if author is critic
        if not self.pk:  # only on creation
            if self.author.is_critic:
                self.is_critic_review = True

        super().save(*args, **kwargs)
        self.venue.update_rating()