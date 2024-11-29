from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import User, Transaction, Category
from rest_framework import status, generics
from .serializer import ReactSerializer, TransactionSerializer, CategorySerializer
from django.db import transaction

from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.core.mail import EmailMessage
import io

from django.shortcuts import render
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.http import HttpResponse


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



def generate_pdf(request, id_user):
    try:
        print(f"Generating PDF for user {id_user}")
        template = get_template('logic/pdf_template.html')
        
        context = {'id_user': id_user}  
        html = template.render(context)
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="user_{id_user}_report.pdf"'
        
        pisa_status = pisa.CreatePDF(html, dest=response)
        
        if pisa_status.err:
            print(f"Error generating PDF: {pisa_status.err}")
            return HttpResponse('We had some errors generating the PDF.')
        
        print("PDF generated successfully")
        return response
    except Exception as e:
        print(f"Error in generate_pdf view: {str(e)}")
        return HttpResponse(f'Error: {str(e)}')


@api_view(['GET'])
def email_pdf(request, id_user):
    transactions = Transaction.objects.filter(id_user=id_user)
    categories = Category.objects.filter(users__id_user=id_user)
    
    template = get_template('pdf_template.html')
    context = {
        'transactions': transactions,
        'categories': categories,
    }
    html = template.render(context)
    
    pdf_file = io.BytesIO()
    pisa.CreatePDF(html, dest=pdf_file)
    pdf_file.seek(0)

    email = EmailMessage(
        'Your Financial Report',
        'Please find your financial report attached.',
        'your-email@example.com',
        ['user@example.com'],
    )
    email.attach(f'report_{id_user}.pdf', pdf_file.read(), 'application/pdf')
    email.send()
    return Response({"message": "PDF sent successfully!"}, status=200)