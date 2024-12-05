from celery import shared_task
from django.utils.timezone import now
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from weasyprint import HTML
from io import BytesIO
from django.db.models import Sum  
from .models import User, Transaction 

@shared_task
def send_periodic_emails():
    users = User.objects.all()
    today = now()
    
    for user in users:
        if user.periodicity == 'daily' or \
           (user.periodicity == 'weekly' and today.weekday() == 0) or \
           (user.periodicity == 'monthly' and today.day == 1):

            transactions = Transaction.objects.filter(id_user=user)
            
            income_total = transactions.filter(type=0).aggregate(total=Sum('mount'))['total'] or 0
            expense_total = transactions.filter(type=1).aggregate(total=Sum('mount'))['total'] or 0
            
            context = {
                'transactions': transactions,
                'balance': income_total - expense_total,
            }

            html_content = render_to_string('pdf_template.html', context)
            pdf_file = BytesIO()
            HTML(string=html_content).write_pdf(target=pdf_file)
            pdf_file.seek(0)

            email = EmailMessage(
                subject=f"Financial Report - {today.strftime('%B %Y')}",
                body="Here is your periodic financial report.",
                from_email="ariadnamich10@gmail.com",
                to=[user.email]
            )
            email.attach(f"report_{user.id_user}.pdf", pdf_file.read(), "application/pdf")
            email.send()
