from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import User, Transaction
from rest_framework import status, generics
from .serializer import ReactSerializer, TransactionSerializer
#from rest_framework.generics import ListAPIView


class ReactView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = ReactSerializer

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

class TransactionUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = TransactionSerializer
    lookup_field = 'id_transaction'

    def get_queryset(self):
        id_user = self.kwargs['id_user']
        return Transaction.objects.filter(id_user=id_user)
    
#class UserTransactionListView(ListAPIView):
    #serializer_class = TransactionSerializer

    #def get_queryset(self):
        #id_user = self.kwargs['id_user']
        #return Transaction.objects.filter(id_user=id_user)