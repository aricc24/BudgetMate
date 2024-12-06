from celery import shared_task
from .models import ScheduledTransaction, Transaction
from django.utils.timezone import now
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

@shared_task
def process_scheduled_transactions():
    current_time = now()
    scheduled_transactions = ScheduledTransaction.objects.filter(date__lte=current_time)

    for scheduled in scheduled_transactions:
        transaction = Transaction.objects.create(
            id_user=scheduled.id_user,
            mount=scheduled.mount,
            description=scheduled.description,
            type=scheduled.type,
        )
        transaction.categories.set(scheduled.categories.all())
        transaction.save()

        if scheduled.periodicity == 'daily':
            scheduled.date += timedelta(days=1)
        elif scheduled.periodicity == 'weekly':
            scheduled.date += timedelta(weeks=1)
        elif scheduled.periodicity == 'monthly':
            scheduled.date += relativedelta(months=1)
        elif scheduled.periodicity == 'yearly':
            scheduled.date += relativedelta(years=1)

        scheduled.save()
