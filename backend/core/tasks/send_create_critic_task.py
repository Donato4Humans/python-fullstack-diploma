from configs.celery import app
from core.services.email_service import EmailService


@app.task
def send_create_critic_task(email, name):
    EmailService.send_email(
        to=email,
        template_name='create_critic.html',
        context={'name': name},
        subject='Critic promotion'
    )