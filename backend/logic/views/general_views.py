from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.utils.dateparse import parse_date
from django.http import HttpResponse
from django.shortcuts import render
from io import BytesIO
import matplotlib.pyplot as plt
import base64
from django.db.models import Sum
from matplotlib.dates import DateFormatter, AutoDateLocator
from weasyprint import HTML
from matplotlib.colors import to_hex
import random
from django.core.mail import EmailMessage
from datetime import datetime
from logic.models import User, Transaction, Debt, ScheduledTransaction
from logic.serializer import TransactionSerializer
from datetime import datetime, timezone
from django.utils import timezone
from django.template.loader import render_to_string

from django.utils.timezone import now
from django.utils.dateparse import parse_datetime

@api_view(['GET'])
def filter_transactions(request, id_user):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    categories = request.GET.getlist('categories')
    min_amount = request.GET.get('min_amount')
    max_amount = request.GET.get('max_amount')
    transaction_type = request.GET.get('type')

    transactions = Transaction.objects.filter(id_user=id_user)
    
    if transaction_type == 'expenses':
        transactions = transactions.filter(type=Transaction.TransEnum.EXPENSE)
    elif transaction_type == 'incomes':
        transactions = transactions.filter(type=Transaction.TransEnum.INCOME)
    if start_date:
        transactions = transactions.filter(date__gte=parse_date(start_date))
    if end_date:
        end_date = datetime.combine(parse_date(end_date), datetime.max.time())
        transactions = transactions.filter(date__lte=end_date)
    if min_amount:
        transactions = transactions.filter(mount__gte=float(min_amount))
    if max_amount:
        transactions = transactions.filter(mount__lte=float(max_amount))
    if categories:
        transactions = transactions.filter(categories__in=categories).distinct()

    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def generate_pdf(request, id_user):
   user = User.objects.get(id_user=id_user)
   transactions = Transaction.objects.filter(id_user=user).select_related('id_user').prefetch_related('categories')
   debts = Debt.objects.filter(id_user=user) 
   scheduled_transactions = ScheduledTransaction.objects.filter(user=user).prefetch_related('categories')

   income_data = transactions.filter(type=Transaction.TransEnum.INCOME)
   expense_data = transactions.filter(type=Transaction.TransEnum.EXPENSE)
   
   total_income = sum(t.mount for t in income_data)
   total_expenses = sum(t.mount for t in expense_data)
   
   total_paid_debt = sum(d.totalAmount for d in debts if d.status == Debt.StatusEnum.PAID)
   total_pending_debt = sum(d.totalAmount for d in debts if d.status == Debt.StatusEnum.PENDING)
   total_overdue_debt = sum(d.totalAmount for d in debts if d.status == Debt.StatusEnum.OVERDUE)
   
   main_balance = total_income - total_expenses #+ total_paid_debt)
   debt_balance = total_pending_debt + total_overdue_debt
   suggested_balance = total_income - (total_expenses + total_paid_debt + debt_balance)
   
   main_balance_message = ( f"${main_balance:.2f}")
   debt_balance_message = f"${debt_balance:.2f}"
   suggested_balance_message = f"${suggested_balance:.2f}"


   income_dates = [t.date for t in income_data]
   income_amounts = [t.mount for t in income_data]
   expense_dates = [t.date for t in expense_data]
   expense_amounts = [t.mount for t in expense_data]


   #Line Graph Incomes
   fig, ax = plt.subplots(figsize=(10, 6))
   ax.plot(income_dates, income_amounts, label='Ingresos', color='green', linewidth=2)
   ax.scatter(income_dates, income_amounts, color='black', zorder=5, label='Entries')
   ax.set_xlabel('Date')
   ax.set_ylabel('Amount ($)')
   ax.set_title('Income over Time')
   ax.xaxis.set_major_locator(AutoDateLocator())
   ax.xaxis.set_major_formatter(DateFormatter("%Y-%m-%d"))
   ax.tick_params(axis='x', rotation=45)
   ax.legend()
   ax.grid(visible=True, linestyle='--', alpha=0.6)
   income_line_chart_image = BytesIO()
   fig.tight_layout()
   fig.savefig(income_line_chart_image, format='png')
   income_line_chart_image.seek(0)
   income_line_chart_base64 = base64.b64encode(income_line_chart_image.read()).decode('utf-8')

   #Line Graph Expenses
   fig, ax = plt.subplots(figsize=(10, 6))
   ax.plot(expense_dates, expense_amounts, label='Egresos', color='red', linewidth=2)
   ax.scatter(expense_dates, expense_amounts, color='black', zorder=5, label='Entries')
   ax.set_xlabel('Date')
   ax.set_ylabel('Amount ($)')
   ax.set_title('Expenses over Time')
   ax.xaxis.set_major_locator(AutoDateLocator())
   ax.xaxis.set_major_formatter(DateFormatter("%Y-%m-%d"))
   ax.tick_params(axis='x', rotation=45)
   ax.legend()
   ax.grid(visible=True, linestyle='--', alpha=0.6)
   expense_line_chart_image = BytesIO()
   fig.tight_layout()
   fig.savefig(expense_line_chart_image, format='png')
   expense_line_chart_image.seek(0)
   expense_line_chart_base64 = base64.b64encode(expense_line_chart_image.read()).decode('utf-8')

   #Category Graph Incomes
   income_categories = income_data.values('categories__category_name').annotate(total=Sum('mount'))
   category_names = [cat['categories__category_name'] for cat in income_categories]
   category_totals = [cat['total'] for cat in income_categories]
   income_colors = [to_hex((random.random(), random.random(), random.random())) for _ in category_names]
   fig, ax = plt.subplots(figsize=(8, 8))
   ax.pie(category_totals, labels=category_names, autopct='%1.1f%%', colors=income_colors)
   ax.set_title('Income Distribution by Category')
   income_pie_chart_image = BytesIO()
   fig.savefig(income_pie_chart_image, format='png')
   income_pie_chart_image.seek(0)
   income_pie_chart_base64 = base64.b64encode(income_pie_chart_image.read()).decode('utf-8')

   #Category Graph Expenses
   expense_categories = expense_data.values('categories__category_name').annotate(total=Sum('mount'))
   category_names_expense = [cat['categories__category_name'] for cat in expense_categories]
   category_totals_expense = [cat['total'] for cat in expense_categories]
   expense_colors = [to_hex((random.random(), random.random(), random.random())) for _ in category_names_expense]
   fig, ax = plt.subplots(figsize=(8, 8))
   ax.pie(category_totals_expense, labels=category_names_expense, autopct='%1.1f%%', colors=expense_colors)
   ax.set_title('Expenses Distribution by Category')
   expense_pie_chart_image = BytesIO()
   fig.savefig(expense_pie_chart_image, format='png')
   expense_pie_chart_image.seek(0)
   expense_pie_chart_base64 = base64.b64encode(expense_pie_chart_image.read()).decode('utf-8')

   context = {
       'transactions': transactions,
       'debts': debts,
       'scheduled_transactions': scheduled_transactions,
       'income_line_chart_base64': income_line_chart_base64,
       'expense_line_chart_base64': expense_line_chart_base64,
       'income_pie_chart_base64': income_pie_chart_base64,
       'expense_pie_chart_base64': expense_pie_chart_base64,
       'main_balance_message': main_balance_message,
       'debt_balance_message': debt_balance_message,
       'suggested_balance_message': suggested_balance_message,
       'total_income' : total_income, 
       'total_expenses' : total_expenses, 
       'total_paid_debt': total_paid_debt, 
       'total_pending_debt': total_pending_debt, 
       'total_overdue_debt': total_overdue_debt,

   }


   response = HttpResponse(content_type='application/pdf')
   response['Content-Disposition'] = f'attachment; filename="report_{id_user}.pdf"'
   from weasyprint import HTML
   html = render(request, 'pdf_template.html', context)
   pdf = HTML(string=html.content.decode('utf-8')).write_pdf()


   response.write(pdf)
   return response


@api_view(['POST'])
def send_email(request, id_user):
    user = User.objects.get(id_user=id_user)
    transactions = Transaction.objects.filter(id_user=user)
    context = {'transactions': transactions,}
    html_content = render(request, 'pdf_template.html', context).content.decode('utf-8')

    with open(f'temp_html_{id_user}.html', 'w') as f:
        f.write(html_content)

    if 'data:image/png;base64,' not in html_content:
        return HttpResponse("Error: Las imágenes base64 no están en el HTML generado.")

    pdf_file = BytesIO()
    HTML(string=html_content).write_pdf(target=pdf_file)
    pdf_file.seek(0)
    subject = "Your Financial Report"
    message = "Hi, attached is your financial report. Thank you for using our service!"
    email = EmailMessage(
        subject,
        message,
        to=[user.email],
        from_email='ariadnamich10@gmail.com'
    )
    email.attach(f'report_{id_user}.pdf', pdf_file.read(), 'application/pdf')

    try:
        email.send()
        return HttpResponse("Email sent successfully!")
    except Exception as e:
        return HttpResponse(f"Failed to send email: {e}")
    

def send_email_to_user(user_id):
    user = User.objects.get(id_user=user_id)
    transactions = Transaction.objects.filter(id_user=user)
    context = {'transactions': transactions}

    html_content = render_to_string('pdf_template.html', context)

    pdf_file = BytesIO()
    HTML(string=html_content).write_pdf(target=pdf_file)
    pdf_file.seek(0)

    subject = "Your Financial Report"
    message = "Hi, attached is your financial report. Thank you for using our service!"
    email = EmailMessage(
        subject,
        message,
        to=[user.email],
        from_email='ariadnamich10@gmail.com'
    )
    email.attach(f'report_{user.id_user}.pdf', pdf_file.read(), 'application/pdf')

    email.send()


@api_view(['POST'])
def update_email_schedule(request, id_user):
    try:
        user = User.objects.get(id_user=id_user)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    frequency = request.data.get('frequency', 'monthly')  
    start_date = request.data.get('start_date', now().isoformat())  

    try:
        start_date = parse_datetime(start_date)
        if not start_date:
            raise ValueError("Invalid date format")
    except ValueError:
        return Response({'error': 'Invalid start_date format'}, status=status.HTTP_400_BAD_REQUEST)

    valid_frequencies = ['daily', 'weekly', 'monthly', 'yearly']
    if frequency not in valid_frequencies:
        return Response({'error': 'Invalid frequency'}, status=status.HTTP_400_BAD_REQUEST)

    user.email_schedule_frequency = frequency
    user.email_schedule_start_date = start_date
    user.save()

    return Response({
        'message': 'Email schedule updated successfully!',
        'data': {
            'frequency': user.email_schedule_frequency,
            'start_date': user.email_schedule_start_date.isoformat(),
        }
    }, status=status.HTTP_200_OK)

