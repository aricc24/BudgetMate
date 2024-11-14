from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import *
from logic.serializer import TransactionSerializer

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