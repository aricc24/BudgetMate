from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializer import *
# Create your views here.

class ReactView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = ReactSerializer
