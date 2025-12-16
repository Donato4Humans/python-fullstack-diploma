
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from core.models import BaseModel

from apps.venues.models import VenueModel


class SponsoredTopModel(BaseModel):
    """
        Admin-moderated top list (sponsored/promoted venues)
    """
    class Meta:
        db_table = 'sponsored_top'
        ordering = ['position']
        unique_together = ('venue', 'position')

    venue = models.ForeignKey(
        VenueModel,
        on_delete=models.CASCADE,
        related_name='sponsored_positions',
        limit_choices_to={'is_active': True, 'is_moderated': True}
    )
    position = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(20)],
        unique=True,
        help_text="Position in sponsored top (1 = first)"
    )
    note = models.CharField(
        max_length=100,
        blank=True,
        help_text="Admin note (e.g., 'Paid promotion until Dec 31')"
    )

    def __str__(self):
        return f"{self.position}. {self.venue.title} ({self.note or 'Sponsored'})"