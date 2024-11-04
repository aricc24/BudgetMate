from django.urls import path
from . import views
from .views import UserRegisterView

urlpatterns = [
    path("api/register/", UserRegisterView.as_view(), name="register"),
    path('login/', UserLoginView.as_view(), name='login'),
]
