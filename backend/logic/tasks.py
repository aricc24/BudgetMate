from celery import shared_task
from .models import ScheduledTransaction, Transaction, User
from django.utils.timezone import now
from datetime import timedelta
from dateutil.relativedelta import relativedelta
from logic.views.general_views import send_email_to_user


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

@shared_task
def send_scheduled_emails():
    users = User.objects.all()
    today = now().date()

    for user in users:
        next_send_date = user.email_schedule_start_date
        frequency = user.email_schedule_frequency

        if frequency == 'daily' and next_send_date <= today:
            send_email_to_user(user.id_user)
            user.email_schedule_start_date = today + timedelta(days=1)
        elif frequency == 'weekly' and next_send_date <= today:
            send_email_to_user(user.id_user)
            user.email_schedule_start_date = today + timedelta(weeks=1)
        elif frequency == 'monthly' and next_send_date <= today:
            send_email_to_user(user.id_user)
            user.email_schedule_start_date = today + relativedelta(months=1)
        elif frequency == 'yearly' and next_send_date <= today:
            send_email_to_user(user.id_user)
            user.email_schedule_start_date = today + relativedelta(years=1)
        
        user.save()
