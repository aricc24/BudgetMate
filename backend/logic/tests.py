from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import *
from logic.serializer import TransactionSerializer, DebtsSerializer
from datetime import date, timedelta

class APITest(TestCase):
    """
    This class contains automated tests to verify the correct functionality of the API views
    for handling users, transactions, categories, and debts.
    """
    def setUp(self):
        """
        This method runs before each individual test. It sets up the testing environment by creating
        a user, categories, and the necessary URLs for the tests.
        """
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
        self.get_debts_url = reverse ('debts-info', kwargs={'id_user': self.user.id_user})


    def test_login(self):
        """
        Verifies that the login works correctly with correct credentials and fails with incorrect credentials.
        """
        data = {"email": "testuser@gmail.com","password": "123password"}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Logged in successfully!", response.data["message"])
        data = {"email": "user_incorrect@gmail.com","password": "wrongpassword"}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Sorry, invalid data", response.data["message"])

    def test_get_user(self):
        """
        Verifies that the user's information is correct when retrieved.
        """
        data = {"id": self.user.id_user}
        response = self.client.post(self.user_info_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "testuser@gmail.com")

    def test_create_transaction(self):
        """
        Verifies that a transaction can be created correctly.
        """
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
        """
        Verifies that a transaction can be updated correctly.
        """
        transaction = Transaction.objects.create(
            id_user=self.user,
            mount=100.14,
            type=Transaction.TransEnum.EXPENSE,
            description="Initial transaction"
        )
        update_url = reverse('transaction-update', kwargs={
            'id_user': self.user.id_user,
            'id_transaction': transaction.id_transaction})
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
        """
        Verifies that the transactions for a user can be retrieved.
        """
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
        """
        Verifies that a category can be updated correctly.
        """
        update_url = reverse('category-update', kwargs={'id_user': self.user.id_user, 'id_category': self.category.id_category})
        data = { "category_name": "Updated Category"}
        response = self.client.patch(update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.category.refresh_from_db()
        self.assertEqual(self.category.category_name, "Updated Category")

    def test_update_globalCategory(self):
        """
        Verifies that a global category cannot be modified.
        """
        user = User.objects.create(email="user@user.com",password="password12365",)
        global_category = Category.objects.create(category_name="housing", is_universal=True)
        user.categories.add(global_category)
        update_url = reverse('category-update', kwargs={'id_user': user.id_user, 'id_category': global_category.id_category})
        data = { "category_name": "new housing"}
        response = self.client.patch(update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Cannot modify global categories.")

    def test_Ucategory_of_Auser(self):
        """
        Verifies that a user cannot modify categories associated with other users.
        """
        user1 = User.objects.create(email="user1@example.com",password="password123",)

        user2 = User.objects.create(email="user2@example.com",password="password123",)
        user_category = Category.objects.create(category_name="Sep", is_universal=False)
        user1.categories.add(user_category)
        update_url = reverse('category-update', kwargs={'id_user': user2.id_user, 'id_category': user_category.id_category})
        data = {"category_name": "Updated Sep"}
        response = self.client.patch(update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Category is not associated with this user.")

    def test_create_debt(self):
        """
        Verifies that a new debt can be created successfully with the correct data.
        """
        data = {
            "id_user": self.user.id_user,
            "mount": 10.0,
            "description": "School",
            "lender": "Carlos",
            "hasInterest": False,
            "interestAmount": 0.0,
            "init_date": timezone.now().isoformat(),
            "due_date": (timezone.now() + timedelta(days=30)).isoformat(),
            "status": 0
        }
        response = self.client.post(self.debt_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["lender"], "Carlos")
        self.assertEqual(response.data["status"], 0)
        self.assertEqual(response.data["interestAmount"], 0.0)
        self.assertEqual(response.data["id_debt"], 1)
        print(response.data)
        print(data)

    def test_get_debts_by_user(self):
        """
        Verifies that the debts for a user can be retrieved and matched with the database entries.
        """
        Debt.objects.create(
            id_user=self.user,
            mount=5.0,
            lender="Karen",
            hasInterest=False,
            interestAmount=0.0,
            init_date= timezone.now(),
            due_date= timezone.now() + timedelta(days=200),
            description="Nails",
            status=Debt.StatusEnum.PAID
        )
        Debt.objects.create(
            id_user=self.user,
            mount=250.0,
            lender="Ernesto",
            hasInterest=True,
            interestAmount=10.0,
            init_date=timezone.now(),
            due_date=timezone.now() + timedelta(days=365),
            description="Underwear",
            status=Debt.StatusEnum.PENDING
        )
        response = self.client.get(self.get_debts_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        debts = Debt.objects.filter(id_user=self.user)
        serializer = DebtsSerializer(debts, many=True)
        self.assertEqual(response.data, serializer.data)
        print(serializer.data)
        self.assertEqual(len(response.data), 2)

    def test_update_debt(self):
        """
        Verifies that a debt can be updated with new data and reflects the changes in the response.
        """
        debt = Debt.objects.create(
            id_user=self.user,
            mount=1000.0,
            lender="Pepe",
            hasInterest=False,
            interestAmount=0.0,
            init_date=timezone.now(),
            due_date=timezone.now() + timedelta(days=32),
            description="Underwear",
            status=Debt.StatusEnum.PENDING
        )
        update_url = reverse('debt-update', kwargs={'id_user': self.user.id_user,'id_debt': debt.id_debt})
        data = {
            "mount": 20563.98,
            "description": "Updated debt description",
            "hasInterest": True,
            "interestAmount": 200.09,
            "lender": "Carls"
        }
        response = self.client.patch(update_url, data, format='json')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["mount"], 20563.98)
        self.assertEqual(response.data["hasInterest"], True)
        self.assertEqual(response.data["interestAmount"], 200.09)
        self.assertEqual(response.data["description"], "Updated debt description")

    def test_create_new_category_if_associated_with_another_user(self):
        """
        Verifies that if a category is shared between users, it can be updated for one user
        without affecting the other user’s data.
        """
        user1 = User.objects.create(email="user1@example.com", password="password123")
        user2 = User.objects.create(email="user2@example.com", password="password123")
        shared_category = Category.objects.create(category_name="Together", is_universal=False)

        user1.categories.add(shared_category)
        user2.categories.add(shared_category)

        update_url = reverse('category-update', kwargs={'id_user': user2.id_user, 'id_category': shared_category.id_category})
        data = {"category_name": "exclusive"}
        response = self.client.patch(update_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Category.objects.filter(category_name="exclusive").count(), 1)
        self.assertFalse(user1.categories.filter(category_name="exclusive").exists())
        self.assertTrue(user2.categories.filter(category_name="exclusive").exists())
        self.assertTrue(user1.categories.filter(category_name="Together").exists())

    def test_edit_category_if_only_user_associated(self):
        """
        Verifies that a category can be updated if it is associated with only one user.
        """
        user = User.objects.create(email="user@example.com", password="password123")
        single_user_category = Category.objects.create(category_name="Personal Category", is_universal=False)
        user.categories.add(single_user_category)

        update_url = reverse('category-update', kwargs={'id_user': user.id_user, 'id_category': single_user_category.id_category})
        data = {"category_name": "Updated Personal Category"}
        response = self.client.patch(update_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Category.objects.filter(category_name="Updated Personal Category").count(), 1)
        self.assertTrue(user.categories.filter(category_name="Updated Personal Category").exists())

    def test_cannot_edit_global_category(self):
        """
        Verifies that a global category cannot be edited by any user.
        """
        user = User.objects.create(email="user@example.com", password="password123")
        global_category = Category.objects.create(category_name="Global Category", is_universal=True)
        user.categories.add(global_category)
        update_url = reverse('category-update', kwargs={'id_user': user.id_user, 'id_category': global_category.id_category})
        data = {"category_name": "Updated Global Category"}
        response = self.client.patch(update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Cannot modify global categories.")
        self.assertEqual(Category.objects.filter(category_name="Updated Global Category").count(), 0)
