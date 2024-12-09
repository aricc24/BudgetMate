from celery import shared_task
from .models import ScheduledTransaction, Transaction
from django.utils.timezone import now
from datetime import timedelta
from dateutil.relativedelta import relativedelta

@shared_task
def process_scheduled_transactions():
    current_time = now().date()  
    scheduled_transactions = ScheduledTransaction.objects.filter(schedule_date__lte=current_time)

    for scheduled in scheduled_transactions:
        transaction = Transaction.objects.create(
            id_user=scheduled.user,
            mount=scheduled.amount,
            description=scheduled.description,
            type=scheduled.type,
        )
        transaction.categories.set(scheduled.categories.all())
        transaction.save()

        if scheduled.repeat == 'daily':
            scheduled.schedule_date += timedelta(days=1)
        elif scheduled.repeat == 'weekly':
            scheduled.schedule_date += timedelta(weeks=1)
        elif scheduled.repeat == 'monthly':
            scheduled.schedule_date += relativedelta(months=1)
        elif scheduled.repeat == 'none':
            scheduled.delete()
            continue

        scheduled.save()
