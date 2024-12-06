from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import User, Transaction, Category
from rest_framework import status, generics
from django.utils.dateparse import parse_date
from .serializer import ReactSerializer, TransactionSerializer, CategorySerializer
from django.db import transaction
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.shortcuts import render
from io import BytesIO
from .models import User, Transaction
import matplotlib.pyplot as plt
import base64
from PIL import Image
from django.db.models import Sum 
from matplotlib.dates import DateFormatter, AutoDateLocator
from weasyprint import HTML
from matplotlib.colors import to_hex
import random
from django.core.mail import EmailMessage
from rest_framework import generics
from .models import ScheduledTransaction
from .serializer import ScheduledTransactionSerializer

class ReactView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = ReactSerializer

    def perform_create(self, serializer):
        with transaction.atomic():
            user = serializer.save()
            default_categories = [
                {"category_name": "Housing", "is_universal": True},
                {"category_name": "Food", "is_universal": True},
                {"category_name": "Transportation", "is_universal": True},
            ]
            created_categories = []
            for category_data in default_categories:
                category, created = Category.objects.get_or_create(**category_data)
                created_categories.append(category)
            user.categories.add(*created_categories)


@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"message": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        # this if for our logs
        print(f"Email inserted: {email}, Password inserted: {password}")
        print(f"Password in database: {user.password}")

        if user.password == password:
            return Response({"message": "Logged in successfully!", "id": user.id_user, "email": user.email}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Sorry, invalid data"}, status=status.HTTP_401_UNAUTHORIZED)

    except User.DoesNotExist:
        # this if for our logs
        print(f"Email inserted: {email}, Password inserted: {password}")

        return Response({"message": "Sorry, invalid data"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def get_user_info(request):
    id_user = request.data.get('id')
    if not id_user:
        return Response({"error": "ID de usuario no proporcionado"}, status=400)
    try:
        user = User.objects.get(id_user=id_user)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)
    serializer = ReactSerializer(user)
    return Response(serializer.data)

class UserUpdateView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = ReactSerializer
    lookup_field = 'id_user'

class TransactionCreateView(generics.CreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

@api_view(['GET'])
def get_transactions_by_user(request, id_user):
    transactions = Transaction.objects.filter(id_user=id_user)
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_transaction(request, transaction_id):
    try:
        transaction = Transaction.objects.get(id_transaction=transaction_id)
        transaction.delete()
        return Response({'message': 'Transaction deleted successfully!'}, status=status.HTTP_200_OK)
    except Transaction.DoesNotExist:
        return Response({'error': 'Transaction not found!'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
def update_user_transaction(request, id_user, id_transaction):
    try:
        transaction = Transaction.objects.get(id_transaction=id_transaction, id_user=id_user)
    except Transaction.DoesNotExist:
        return Response({"error": "Transaction not found."}, status=status.HTTP_404_NOT_FOUND)
    serializer = TransactionSerializer(transaction, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_categories_by_user(request, id_user):
    try:
        user = User.objects.get(id_user=id_user)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    categories = user.categories.all()
    serializer = CategorySerializer(categories, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_or_associate_category(request):
    category_name = request.data.get('category_name')
    id_user = request.data.get('id_user')
    if not category_name or not id_user:
        return Response({"error": "Both category name and user ID are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id_user=id_user)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    category, created = Category.objects.get_or_create(
        category_name=category_name,
        defaults={'is_universal': False}
    )

    if not user.categories.filter(id_category=category.id_category).exists():
        user.categories.add(category)

    return Response({
        "message": "Category created and associated" if created else "Category already exists and associated",
        "category_name": category.category_name,
        "category_id": category.id_category,
        "user_id": user.id_user
    }, status=status.HTTP_200_OK)

@api_view(['PATCH'])
def update_user_category(request, id_user, id_category):
    try:
        user = User.objects.get(id_user=id_user)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    try:
        category = Category.objects.get(id_category=id_category)
    except Category.DoesNotExist:
        return Response({"error": "Category not found."}, status=status.HTTP_404_NOT_FOUND)
    if category.is_universal:
        return Response({"error": "Cannot modify global categories."}, status=status.HTTP_400_BAD_REQUEST)
    if not user.categories.filter(id_category=category.id_category).exists():
        return Response({"error": "Category is not associated with this user."}, status=status.HTTP_400_BAD_REQUEST)
    if 'category_name' in request.data:
        category.category_name = request.data['category_name']
        category.save()
    return Response({"message": "Category updated successfully", "category": category.category_name}, status=status.HTTP_200_OK)

@api_view(['GET'])
def filter_transactions(request, id_user):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    categories = request.GET.getlist('categories')
    min_amount = request.GET.get('min_amount')
    max_amount = request.GET.get('max_amount')

    transactions = Transaction.objects.filter(id_user=id_user, type=Transaction.TransEnum.EXPENSE)

    if start_date:
        transactions = transactions.filter(date__gte=parse_date(start_date))
    if end_date:
        transactions = transactions.filter(date__lte=parse_date(end_date))
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
   
   income_data = transactions.filter(type=Transaction.TransEnum.INCOME)
   expense_data = transactions.filter(type=Transaction.TransEnum.EXPENSE)

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
       'income_line_chart_base64': income_line_chart_base64,
       'expense_line_chart_base64': expense_line_chart_base64,
       'income_pie_chart_base64': income_pie_chart_base64,
       'expense_pie_chart_base64': expense_pie_chart_base64,
 
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

    context = {
        'transactions': transactions,
    }
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
    

class ScheduledTransactionListCreateView(generics.ListCreateAPIView):
    queryset = ScheduledTransaction.objects.all()
    serializer_class = ScheduledTransactionSerializer

class ScheduledTransactionUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ScheduledTransaction.objects.all()
    serializer_class = ScheduledTransactionSerializer
    lookup_field = 'id_scheduled_transaction'