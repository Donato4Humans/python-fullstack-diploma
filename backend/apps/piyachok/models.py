
from django.core import validators as V
from django.db import models

from core.models import BaseModel

from apps.user.models import UserModel
from apps.venues.models import VenueModel


class PiyachokRequestModel(BaseModel):
    """
        User's "Пиячок" request — looking for company
    """
    class Meta:
        db_table = 'piyachok_requests'
        ordering = ['-created_at']

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('A', 'Any'),
    ]

    WHO_PAYS_CHOICES = [
        ('me', 'I pay'),
        ('them', 'They pay'),
        ('split', 'Split'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('matched', 'Matched'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    ]

    requester = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name='piyachok_requests'
    )
    gender_preference = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        default='A'
    )
    budget = models.PositiveIntegerField(
        validators=[V.MinValueValidator(1)],
        help_text="Budget in UAH"
    )
    who_pays = models.CharField(
        max_length=10,
        choices=WHO_PAYS_CHOICES,
        default='split'
    )
    preferred_venue = models.ForeignKey(
        VenueModel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='piyachok_requests'
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )
    note = models.TextField(
        blank=True,
        help_text="Additional message"
    )

    def __str__(self):
        return f"{self.requester.profile.name} — {self.get_gender_preference_display()} — {self.budget} UAH"


class MatchModel(BaseModel):
    """
        Match between two Piyachok requests
    """
    class Meta:
        db_table = 'piyachok_matches'
        ordering = ['-created_at']
        unique_together = ('request1', 'request2')

    request1 = models.ForeignKey(
        PiyachokRequestModel,
        on_delete=models.CASCADE,
        related_name='matches_as_request1'
    )
    request2 = models.ForeignKey(
        PiyachokRequestModel,
        on_delete=models.CASCADE,
        related_name='matches_as_request2',
        null=True,
        blank=True
    )
    suggested_venue = models.ForeignKey(
        VenueModel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='suggested_matches'
    )
    is_accepted = models.BooleanField(default=False)
    note = models.TextField(blank=True)
    chat_room_id = models.CharField(
        max_length=100,
        unique=True,
        blank=True,
        help_text="Unique room name for match chat"
    )

    def __str__(self):
        return f"Match: {self.request1.requester} ↔ {self.request2.requester}"