import os

from django.db import models

from core.models import BaseModel
from core.services.file_service import upload_news_photo

from apps.venues.models import VenueModel


class NewsModel(BaseModel):
    """
        News model:
            - Global news (venue=None)
            - Venue-specific news (venue=linked)
            - Promotions & Events (type field)
            - Paid promotions (is_paid=True)
    """
    class Meta:
        db_table = 'news'
        ordering = ['-created_at']

    NEWS_TYPE_CHOICES = [
        ('general', 'General'),
        ('promotion', 'Promotion'),
        ('event', 'Event'),
    ]

    title = models.CharField(max_length=100)
    content = models.TextField()
    photo = models.ImageField(
        upload_to=upload_news_photo,
        blank=True,
        null=True
    )
    type = models.CharField(
        max_length=20,
        choices=NEWS_TYPE_CHOICES,
        default='general'
    )
    is_paid = models.BooleanField(
        default=False,
        help_text="Paid promotions appear in special sections"
    )
    venue = models.ForeignKey(
        VenueModel,
        on_delete=models.CASCADE,
        related_name='news',
        null=True,
        blank=True,
        help_text="If null — global news, else — venue-specific"
    )

    def __str__(self):
        venue_name = self.venue.title if self.venue else "Global"
        return f"{venue_name} — {self.title} ({self.get_type_display()})"

    def delete(self, *args, **kwargs):
        if self.photo:
            try:
                os.remove(self.photo.path)
            except Exception as e:
                print(f'Could not delete photo: {e}')
        super().delete(*args, **kwargs)