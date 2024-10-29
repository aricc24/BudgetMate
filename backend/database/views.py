# data/views.py
from django.shortcuts import render
from .models import User

def database(request):
    database = User.objects.all()
    return render(request, 'database.html', {'database': database})