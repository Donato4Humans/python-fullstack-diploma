from configs.celery import app
from core.services.email_service import EmailService

from apps.user.models import UserModel
from apps.venues.models import VenueModel


@app.task
def send_blocked_venue_banned_words_email_task(venue_id):
    try:
        venue = VenueModel.objects.get(id=venue_id)
    except VenueModel.DoesNotExist:
        return

    admin = UserModel.objects.filter(is_superuser=True).exclude(email=None)


    if not admin.email:
        return

    EmailService.send_email.delay(
          to=admin.email,
          template_name='blocked_venue.html',
          context={
             'venue_id': venue.id,
             'owner_name': venue.owner.user.profile.name,
             'description': venue.description,
         },
          subject='Blocked venue due to obscene language',
     )