from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
app = Celery('backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.conf.beat_schedule = {
    'process-scheduled-transactions-every-minute': {
        'task': 'logic.tasks.process_scheduled_transactions',
        'schedule': crontab(minute='*/1'),  # Ejecutar cada minuto
    },

    'send-scheduled-emails-daily': {
        'task': 'logic.tasks.send_scheduled_emails',
        'schedule': crontab(hour=0, minute=0),  #todos los días a las doce en punto
    },
}

app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

