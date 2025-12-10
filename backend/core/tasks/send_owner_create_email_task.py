from configs.celery import app
from core.services.email_service import EmailService


@app.task
def send_owner_create_email_task(email, name):
    EmailService.send_email(
        to=email,
        template_name='owner_create.html',
        context={'name': name},
        subject='Owner Created'
    )