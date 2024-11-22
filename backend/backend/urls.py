"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from logic.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', ReactView.as_view(), name="user-list"),
    path('api/login/', login_view, name="user-log"),
    path('api/get_user/', get_user_info, name="user-info"),
    path('api/update_user/<int:id_user>/', UserUpdateView.as_view(), name="user-update"),
    path('api/transactions/', TransactionCreateView.as_view(), name="transactions-list"),
    path('api/get_transactions/<int:id_user>/', get_transactions_by_user, name="transactions-info"),
    path('api/update_transaction/<int:id_user>/<int:id_transaction>/', update_user_transaction, name="transaction-update"),
    path('api/get_categories/<int:id_user>/', get_categories_by_user, name="get-categories"),
    path('api/create_category/', create_or_associate_category, name="create-category")
]
