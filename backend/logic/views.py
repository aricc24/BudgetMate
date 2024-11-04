from rest_framework import generics
from .models import User
from .serializer import ReactSerializer

class ReactView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = ReactSerializer
