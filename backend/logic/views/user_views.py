from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from logic.models import User, Category
from logic.serializer import UserSerializer
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
import traceback

class CustomRefreshToken(RefreshToken):
    def __init__(self, user):
        super().__init__()
        self.payload['user_id'] = user.id_user

class UserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

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

            refresh = CustomRefreshToken(user)
            verification_link = self.request.build_absolute_uri(
                reverse('verify_email') + f'?token={refresh.access_token}'
            )

            send_mail(
                'Verify your BudgetMate account',
                f'Click the link to verify your account: {verification_link}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )


@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    if not email or not password:
        return Response({"message": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        print(f"Email inserted: {email}, Password inserted: {password}")
        print(f"Password in database: {user.password}")
        if not user.is_verified:
            return Response({'error': 'Account not verified. Plese, check your email.'}, status=403)
        if user.password == password:
            return Response({"message": "Logged in successfully!", "id": user.id_user, "email": user.email}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Sorry, invalid data"}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
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

    serializer = UserSerializer(user)
    return Response(serializer.data)

class UserUpdateView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id_user'

@api_view(['GET'])
def verify_email(request):
    token = request.GET.get('token')
    if not token:
        return JsonResponse({'error': 'There is no token.'}, status=400)
    try:
        access_token = AccessToken(token)
        print(access_token.payload)
        id = access_token.payload['user_id']
        user = User.objects.get(id_user=id)
        if user.is_verified:
            return HttpResponseRedirect('http://localhost:3000/verify-email?status=already_verified')

        user.is_verified = True
        user.save()
        return HttpResponseRedirect('http://localhost:3000/verify-email?status=success')
    except Exception as e:
        print(f"Ocurrió un error: {e}")
        traceback.print_exc()
        return HttpResponseRedirect('http://localhost:3000/verify-email?status=error')
