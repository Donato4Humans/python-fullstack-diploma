from django.db import models

from core.models import BaseModel

from apps.venues.models import VenueModel


class TagModel(BaseModel):
    """
        Available tags for filtering venues (cafe, wi-fi, terrace, live_music, etc.)
    """
    class Meta:
        db_table = 'tags'
        ordering = ['name']
        unique_together = ('name',)

    name = models.CharField(
        max_length=50,
        unique=True,
        help_text="Tag name (e.g., 'wifi', 'terrace', 'live_music')"
    )

    def __str__(self):
        return self.name


class VenueTag(BaseModel):
    """
        Many-to-many relationship between Venue and Tag
    """
    class Meta:
        db_table = 'venue_tags'
        unique_together = ('venue', 'tag')  # one tag per venue once

    venue = models.ForeignKey(
        VenueModel,
        on_delete=models.CASCADE,
        related_name='venue_tags'
    )
    tag = models.ForeignKey(
        TagModel,
        on_delete=models.CASCADE,
        related_name='venue_tags'
    )

    def __str__(self):
        return f"{self.venue.title} — {self.tag.name}"