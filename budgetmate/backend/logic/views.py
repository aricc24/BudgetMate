from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import*
from .models import*
from rest_framework import permissions, status, viewsets, generics
# Create your views here.

class ReactView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = ReactSerializer


class UserRegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegisterSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return Response({"message": "The user has been created successfully.", "user_id": user.id_user}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')


        return Response({'message': 'Login successful', 'user_id': 1}, status=status.HTTP_200_OK)
