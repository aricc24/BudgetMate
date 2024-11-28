from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import User, Transaction, Category
from rest_framework import status, generics
from .serializer import ReactSerializer, TransactionSerializer, CategorySerializer
#from rest_framework.generics import ListAPIView

from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from django.shortcuts import redirect

class ReactView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = ReactSerializer
    # def dispatch(self, request, *args, **kwargs):
    #     print(f"Request method: {request.method}")  # Muestra el método HTTP
    #     response = super().dispatch(request, *args, **kwargs)
    #     print(f"Response status: {response.status_code}")  # Muestra el código de estado de la respuesta
    #     print(f"Response data: {response.data}")  # Muestra los datos de la respuesta
    #     return response

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

    # def dispatch(self, request, *args, **kwargs):
    #     print(f"Request method: {request.method}")  # Muestra el método HTTP (POST)
    #     response = super().dispatch(request, *args, **kwargs)
    #     print(f"Response status: {response.status_code}")  # Muestra el código de estado de la respuesta (400, 201, etc.)
    #     print(f"Response data: {response.data}")  # Muestra los datos de la respuesta (cuerpo)
    #     return response

@api_view(['GET'])
def get_transactions_by_user(request, id_user):
    transactions = Transaction.objects.filter(id_user=id_user)
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

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


class CustomRefreshToken(RefreshToken):
    def __init__(self, user):
        super().__init__()
        self.payload['user_id'] = user.id_user

@api_view(['POST'])
def register_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Email and password are required."}, status=400)

    try:
        user = User.objects.create(email=email, password=password)
        refresh = CustomRefreshToken(user)
        verification_link = request.build_absolute_uri(
            reverse('verify_email') + f'?token={refresh.access_token}'
        )

        send_mail(
            'Verify your BudgetMate account',
            f'Click the link to verify your account: {verification_link}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

        return Response({"message": "User registered successfully. Check your email for verification."}, status=201)

    except Exception as e:
        print(f"Error durante el registro del usuario: {str(e)}")
        return Response({"error": f"Internal server error: {str(e)}"}, status=500)

    
"""
@api_view(['GET'])
def verify_email(request):
    token = request.GET.get('token')
    try:
        payload = RefreshToken(token).payload
        user_id = payload.get('user_id')
        if not user_id:
            return Response({"error": "User ID not found in token."}, status=400)

        user = User.objects.get(id_user=user_id)
        user.is_active = True
        user.save()

        return Response({"message": "Email verified successfully."}, status=200)
    except Exception as e:
        return Response({"error": f"Invalid token. {str(e)}"}, status=400)

"""

@api_view(['GET'])
def verify_email(request):
    token = request.GET.get('token')
    return redirect('http://127.0.0.1:3000/login')  #Frontend!!!
