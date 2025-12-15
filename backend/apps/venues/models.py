import os

from django.core import validators as V
from django.db import models

from core.enums.regex_enum import RegexEnum
from core.models import BaseModel
from core.services.file_service import upload_venue_photo

from apps.venueowners.models import VenueOwnerModel


class VenueModel(BaseModel):
    class Meta:
        db_table = 'venues'

    title = models.CharField(max_length=35)
    schedule = models.CharField(max_length=250)
    description = models.CharField(max_length=250)
    category = models.CharField(max_length=10,
                              choices=[
                                  ('cafe', 'Cafe'),
                                  ('restaurant', 'Restaurant'),
                                  ('bar', 'Bar'),
                                  ('mixed', 'Mixed')],
                              default='mixed')
    photo = models.ImageField(upload_to=upload_venue_photo, blank=True)

    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    house = models.IntegerField(validators=[V.MinValueValidator(1)])
    street = models.CharField(max_length=35, validators=[V.RegexValidator(RegexEnum.STREET_VENUE.pattern, RegexEnum.STREET_VENUE.msg)])
    city = models.CharField(max_length=35, validators=[V.RegexValidator(RegexEnum.CITY_VENUE.pattern, RegexEnum.CITY_VENUE.msg)])
    region = models.CharField(max_length=35, validators=[V.RegexValidator(RegexEnum.REGION_VENUE.pattern, RegexEnum.REGION_VENUE.msg)])
    country = models.CharField(max_length=35, validators=[V.RegexValidator(RegexEnum.CITY_VENUE.pattern, RegexEnum.CITY_VENUE.msg)])

    average_check = models.IntegerField(validators=[V.MinValueValidator(1)])
    rating = models.FloatField(default=0)

    owner = models.ForeignKey(VenueOwnerModel, on_delete=models.CASCADE, related_name='venues')

    is_active = models.BooleanField(default=True)
    is_moderated = models.BooleanField(default=False)
    bad_word_attempts = models.IntegerField(default=0)

    views = models.IntegerField(default=0)
    daily_views = models.IntegerField(default=0)
    weekly_views = models.IntegerField(default=0)
    monthly_views = models.IntegerField(default=0)
    last_view_date = models.DateTimeField(null=True, blank=True)


    def delete(self, *args, **kwargs):
        if self.photo:
            try:
                os.remove(self.photo.path)
            except Exception as e:
                print(f'Could not delete photo: {e}')
        super().delete(*args, **kwargs)

    def update_rating(self):
        avg = self.reviews.aggregate(models.Avg('rating'))['rating__avg']
        self.rating = round(avg or 0, 1)
        self.save(update_fields=['rating'])