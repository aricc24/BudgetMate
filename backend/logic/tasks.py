from celery import shared_task
from django.utils.timezone import now, timedelta
from django.core.mail import EmailMessage
from weasyprint import HTML
from io import BytesIO
from .models import User, Transaction, Category

@shared_task
def send_periodic_emails():
    users = User.objects.all()
    today = now()
    
    for user in users:
        if user.periodicity == 'daily' or \
           (user.periodicity == 'weekly' and today.weekday() == 0) or \
           (user.periodicity == 'monthly' and today.day == 1):

            transactions = Transaction.objects.filter(id_user=user)
            context = {
                'transactions': transactions,
                'balance': transactions.filter(type=0).aggregate(total=models.Sum('mount'))['total'] -
                           transactions.filter(type=1).aggregate(total=models.Sum('mount'))['total'],
            }

            html_content = render_to_string('pdf_template.html', context)
            pdf_file = BytesIO()
            HTML(string=html_content).write_pdf(target=pdf_file)
            pdf_file.seek(0)

            # Send Email
            email = EmailMessage(
                subject=f"Financial Report - {today.strftime('%B %Y')}",
                body="Here is your periodic financial report.",
                from_email="noreply@example.com",
                to=[user.email]
            )
            email.attach(f"report_{user.id_user}.pdf", pdf_file.read(), "application/pdf")
            email.send()
