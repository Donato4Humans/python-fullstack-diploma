
from django.db import models

from core.models import BaseModel

from apps.user.models import UserModel


class VenueOwnerModel(BaseModel):
    class Meta:
        db_table = 'venue_owners'

    user = models.OneToOneField(UserModel, on_delete=models.CASCADE, related_name='venue_owners')
    is_active = models.BooleanField(default=True)