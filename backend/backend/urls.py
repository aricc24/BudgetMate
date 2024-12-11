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
from logic.views.user_views import *
from logic.views.transaction_views import *
from logic.views.category_views import *
from logic.views.debt_views import *
from logic.views.scheduledTransaction_views import *
from logic.views.general_views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', UserView.as_view(), name="user-list"),
    path('api/login/', login_view, name="user-log"),
    path('api/get_user/', get_user_info, name="user-info"),
    path('api/update_user/<int:id_user>/', UserUpdateView.as_view(), name="user-update"),
    path('api/transactions/', TransactionCreateView.as_view(), name="transactions-list"),
    path('api/delete_transaction/<int:transaction_id>/', delete_transaction, name='delete_transaction'),
    path('api/get_transactions/<int:id_user>/', get_transactions_by_user, name="transactions-info"),
    path('api/update_transaction/<int:id_user>/<int:id_transaction>/', update_user_transaction, name="transaction-update"),
    path('api/get_categories/<int:id_user>/', get_categories_by_user, name="get-categories"),
    path('api/create_category/', create_or_associate_category, name="create-category"),
    path('api/update_category/<int:id_user>/<int:id_category>/', update_user_category, name="category-update"),
    path('api/filter_transactions/<int:id_user>/', filter_transactions, name="filter-transaction"),
    path('api/generate_pdf/<int:id_user>/', generate_pdf, name='generate_pdf'),
    path('api/debts/', DebtsCreateView.as_view(), name="debts-list"),
    path('api/get_debts/<int:id_user>/', get_debts_by_user, name="debts-info"),
    path('api/update_debt/<int:id_user>/<int:id_debt>/', update_user_debt, name="debt-update"),
    path('api/delete_debt/<int:id_debt>/', delete_debt, name='delete_debt'),
    path('api/generate_pdf/<int:id_user>/', generate_pdf, name='generate_pdf'),
    path('api/send_email/<int:id_user>/', send_email, name='send_email'),
    path('api/scheduled-transactions/', ScheduledTransactionListCreateView.as_view(), name='list-create-scheduled-transactions'),
    path('api/scheduled-transactions/<int:id_scheduled_transaction>/', ScheduledTransactionUpdateDeleteView.as_view(), name='update-delete-scheduled-transaction'),
    path('api/scheduled-transactions/user/<int:id_user>/', get_scheduled_transactions_by_user, name='get-scheduled-transactions-by-user'),
    path('api/delete_scheduled_transaction/<int:transaction_id>/', delete_scheduled_transaction, name='delete_scheduled_transaction'),
    path('api/update_scheduled_transaction/<int:transaction_id>/', update_scheduled_transaction, name='update_scheduled_transaction'),
    path('api/update_email_schedule/<int:id_user>/', update_email_schedule, name='update_email_schedule'),

]