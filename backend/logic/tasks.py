from celery import shared_task
from .models import ScheduledTransaction, Transaction, User
from django.utils.timezone import now
from datetime import timedelta
from dateutil.relativedelta import relativedelta
from logic.views.general_views import send_email_to_user


@shared_task
def process_scheduled_transactions():
    """
    Processes scheduled transactions, creating new transactions based on the schedule and frequency.

    This task looks for all scheduled transactions that need to be processed and creates corresponding transactions for the users. After a transaction is created, the schedule date
    is updated based on the repeat frequency (daily, weekly, monthly, or yearly). If the repeat frequency is 'none',
    the scheduled transaction is deleted.

    This task is scheduled to run periodically to ensure that transactions are processed according to their schedule.
    """
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
        elif scheduled.repeat == 'yearly':
            scheduled.schedule_date += relativedelta(years=1)
        elif scheduled.repeat == 'none':
            scheduled.delete()
            continue

        print(f"New schedule date: {scheduled.schedule_date}")
        scheduled.save()
        scheduled.save()

@shared_task
def send_scheduled_emails():
    """
    Sends scheduled emails to all users based on their email schedule frequency.

    This task checks the email schedule frequency for each user (daily, weekly, monthly, or yearly) and sends an email
    if the current date matches their scheduled send date. After sending the email, the user's `email_schedule_start_date`
    is updated to the next scheduled send date based on their frequency.
    """
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
