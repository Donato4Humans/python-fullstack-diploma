from configs.celery import app
from core.services.email_service import EmailService


@app.task
def send_venue_added_email_task(email, name, title, schedule, average_check):
    EmailService.send_email(
        to=email,
        template_name='venue_publication.html',
        context={
            'name': name,
            'title': title,
            'schedule': schedule,
            'average_check': average_check,
        },
        subject='Venue Added',
    )