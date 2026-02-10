import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configs.settings')

app = Celery('Car_Sale_platform')
app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
'find-piyachok-matches-every-hour': {
        'task': 'core.tasks.piyachok_match_task.find_matches_task',
        'schedule': crontab(minute=0, hour=0),  # every day
    },
}