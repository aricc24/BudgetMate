from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import *
from logic.serializer import TransactionSerializer
from datetime import date

class APITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            email="testuser@gmail.com",
            password="123password",
            first_name="User",
            last_name_father="Test",
            curp="TESTU123456789",
            rfc="TESTRFC1234"
        )
        self.login_url = reverse('user-log')
        self.user_info_url = reverse('user-info')
        self.transaction_url = reverse('transactions-list')
        self.get_transactions_url = reverse('transactions-info', kwargs={'id_user': self.user.id_user})
        self.category = Category.objects.create(category_name="Example Category", is_universal=False)
        self.user.categories.add(self.category)
        self.debt_url = reverse('debts-list')


    def test_login(self):
        data = {
            "email": "testuser@gmail.com",
            "password": "123password"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Logged in successfully!", response.data["message"])
        data = {
            "email": "user_incorrect@gmail.com",
            "password": "wrongpassword"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Sorry, invalid data", response.data["message"])

    def test_get_user(self):
        data = {"id": self.user.id_user}
        response = self.client.post(self.user_info_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "testuser@gmail.com")

    def test_create_transaction(self):
        data = {
            "id_user": self.user.id_user,
            "mount": 100.0,
            "type": Transaction.TransEnum.EXPENSE,
            "description": "This is a transaction test"
        }
        response = self.client.post(self.transaction_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["mount"], 100.0)
        self.assertEqual(response.data["type"], Transaction.TransEnum.EXPENSE)
        self.assertEqual(response.data["description"], "This is a transaction test")

    def test_update_transaction(self):
        transaction = Transaction.objects.create(
            id_user=self.user,
            mount=100.14,
            type=Transaction.TransEnum.EXPENSE,
            description="Initial transaction"
        )
        update_url = reverse('transaction-update', kwargs={
            'id_user': self.user.id_user,
            'id_transaction': transaction.id_transaction
        })
        data = {
            "mount": 1502.14,
            "type": Transaction.TransEnum.INCOME,
            "description": "Updated transaction description"
        }
        response = self.client.patch(update_url, data, format='json')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["mount"], 1502.14)
        self.assertEqual(response.data["type"], Transaction.TransEnum.INCOME)
        self.assertEqual(response.data["description"], "Updated transaction description")

    def test_get_transactions_by_user(self):
        Transaction.objects.create(
            id_user=self.user,
            mount=50.0,
            type=Transaction.TransEnum.EXPENSE,
            description="Expense transaction"
        )
        Transaction.objects.create(
            id_user=self.user,
            mount=2500.0,
            type=Transaction.TransEnum.INCOME,
            description="Income transaction"
        )
        response = self.client.get(self.get_transactions_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        transactions = Transaction.objects.filter(id_user=self.user.id_user)
        serializer = TransactionSerializer(transactions, many=True)
        self.assertEqual(response.data, serializer.data)
        print(serializer.data)
        self.assertEqual(len(response.data), 2)

    def test_update_category(self):
        update_url = reverse('category-update', kwargs={'id_user': self.user.id_user, 'id_category': self.category.id_category})
        data = { "category_name": "Updated Category"}
        response = self.client.patch(update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.category.refresh_from_db()
        self.assertEqual(self.category.category_name, "Updated Category")
    
    def test_duplicate_category(self):
        user = User.objects.create(
            email="test@gmail.com",
            password="lord123",
        )
        category = Category.objects.create(category_name="Unique Category", is_universal=False)
        user.categories.add(category)
        update_url = reverse('category-update', kwargs={'id_user': user.id_user, 'id_category': category.id_category})
        data = {"category_name": "Unique Category"}
        response = self.client.patch(update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(user.categories.filter(category_name="Unique Category").count(), 1)

    def test_update_globalCategory(self):
        user = User.objects.create(
            email="user@user.com",
            password="password12365",
        )
        global_category = Category.objects.create(category_name="housing", is_universal=True)
        user.categories.add(global_category)
        update_url = reverse('category-update', kwargs={'id_user': user.id_user, 'id_category': global_category.id_category})
        data = { "category_name": "new housing"}
        response = self.client.patch(update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Cannot modify global categories.")

    def test_Ucategory_of_Auser(self):
        user1 = User.objects.create(
            email="user1@example.com",
            password="password123",
        )

        user2 = User.objects.create(
            email="user2@example.com",
            password="password123",
        )
        user_category = Category.objects.create(category_name="Sep", is_universal=False)
        user1.categories.add(user_category)
        update_url = reverse('category-update', kwargs={'id_user': user2.id_user, 'id_category': user_category.id_category})
        data = {"category_name": "Updated Sep"}
        response = self.client.patch(update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Category is not associated with this user.")

    def test_create_debt(self):
        data = {
            "id_user": self.user.id_user,
            "mount": 10.0,
            "description": "School",
            "lender": "Carlos",
            "hasInterest": False,
            "interestAmount": 0.0,
            "init_date": str(date.today()),
            "due_date": str(date(2025, 12, 31)),
            "status": 0
        }
        response = self.client.post(self.debt_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["init_date"], str(date.today()))
        self.assertEqual(response.data["due_date"], str(date(2025, 12, 31)))
        self.assertEqual(response.data["lender"], "Carlos")
        self.assertEqual(response.data["status"], 0)
        self.assertEqual(response.data["interestAmount"], 0.0)