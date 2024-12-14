from django.db import models
from django.utils import timezone
from django.utils.timezone import now


# Create your models here.

class User(models.Model):
    """
    Represents a user in the system, including personal information and settings.

    Attributes:
        id_user: Auto-incrementing primary key for each user.
        email: Unique email address for the user.
        password: User's password.
        first_name: First name of the user (optional).
        last_name_father: Father's last name (optional).
        last_name_mother: Mother's last name (optional).
        tax_address: The user's tax address (optional).
        curp: Unique tax identification code for the user (optional).
        rfc: Unique RFC (taxpayer registration code) (optional).
        phone_number: User's phone number (optional).
        marital_status: Marital status, which can be 'single', 'married', 'divorced', or 'widowed'.
        categories: Many-to-many relationship with Category model.
        email_schedule_frequency: Frequency at which the user receives email notifications ('daily', 'weekly', 'monthly', 'yearly').
        email_schedule_start_date: The date and time when email notifications start.
    """
    id_user = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    first_name = models.CharField(max_length=50, null=True)
    last_name_father = models.CharField(max_length=50, null=True)
    last_name_mother = models.CharField(max_length=50, blank=True, null=True)
    tax_address = models.CharField(max_length=255, null=True)
    curp = models.CharField(max_length=18, unique=True, null=True)
    rfc = models.CharField(max_length=13, unique=True, blank=False, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    SINGLE = 'single'
    MARRIED = 'married'
    DIVORCED = 'divorced'
    WIDOWED = 'widowed'

    MARITAL_STATUS_CHOICES = [
        (SINGLE, 'single'),
        (MARRIED, 'married'),
        (DIVORCED, 'divorced'),
        (WIDOWED, 'widowed'),
    ]

    marital_status = models.CharField(
        max_length=10,
        choices=MARITAL_STATUS_CHOICES,
        default=SINGLE,
        null=True
    )
    categories = models.ManyToManyField('Category', related_name='users')
    email_schedule_frequency = models.CharField(
        max_length=10,
        choices=[
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
            ('monthly', 'Monthly'),
            ('yearly', 'Yearly'),
        ],
        default='monthly',
    )
    email_schedule_start_date = models.DateTimeField(default=now) # ojooo
    is_verified = models.BooleanField(default=False)
    class Meta:
        db_table = 'users'

class Transaction(models.Model):
    """
    Represents a financial transaction, including income and expenses.

    Attributes:
        id_transaction: Auto-incrementing primary key for each transaction.
        id_user: Foreign key relation to the User model, linking the transaction to a specific user.
        mount: The monetary amount involved in the transaction.
        description: A brief description of the transaction (optional).
        type: Specifies whether the transaction is an income or expense.
        date: The date and time of the transaction.
        categories: Many-to-many relationship with Category model for categorizing transactions.
    """
    id_transaction = models.AutoField(primary_key=True)
    id_user = models.ForeignKey('User', on_delete=models.CASCADE)
    mount = models.FloatField()
    description = models.CharField(max_length=128, null=True, blank=True)


    class TransEnum(models.IntegerChoices):
        INCOME =  0, 'Income'
        EXPENSE =  1, 'Expense'

    type = models.IntegerField(
        choices=TransEnum.choices,
        default=TransEnum.INCOME
    )

    date = models.DateTimeField(default=timezone.now)
    categories = models.ManyToManyField('Category', related_name='transactions')
    class Meta:
        db_table = 'transactions'

class Category(models.Model):
    """
    Represents a category for transactions, such as 'Housing', 'Food', etc.

    Attributes:
        id_category: Auto-incrementing primary key for each category.
        category_name: The name of the category (unique).
        is_universal: A flag indicating whether the category is universal (default: False).
    """
    id_category = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=35, unique=True)
    is_universal = models.BooleanField(default=False)
    class Meta:
        db_table = 'categories'

class Debt(models.Model):
    """
    Represents a debt owed by the user.

    Attributes:
        id_debt: Auto-incrementing primary key for each debt.
        id_user: Foreign key relation to the User model, linking the debt to a specific user.
        amount: The amount owed for the debt.
        description: A brief description of the debt (optional).
        lender: The name of the lender (optional).
        hasInterest: Flag indicating whether the debt has interest (default: False).
        interestAmount: The interest amount (default: 0).
        totalAmount: The total amount of the debt (default: 0).
        init_date: The date and time when the debt was incurred.
        due_date: The date and time when the debt is due.
        status: The current status of the debt ('pending', 'overdue', or 'paid').
        transaction: A one-to-one relationship with the Transaction model, linking the debt to a transaction.
    """
    id_debt = models.AutoField(primary_key=True)
    id_user = models.ForeignKey('User', on_delete=models.CASCADE)
    amount = models.FloatField()
    description = models.CharField(max_length=128, null=True, blank=True)
    lender = models.CharField(max_length=35, null=True, blank=True)
    hasInterest = models.BooleanField(default=False)
    interestAmount = models.FloatField(default=0)
    totalAmount = models.FloatField(default=0)
    init_date = models.DateTimeField(default=timezone.now)
    due_date = models.DateTimeField(default=timezone.now)

    class StatusEnum(models.TextChoices):
        PENDING = 'pending', 'Pending'
        OVERDUE = 'overdue', 'Overdue'
        PAID = 'paid', 'Paid'

    status = models.CharField(max_length=10, choices=StatusEnum.choices, default=StatusEnum.PENDING)
    transaction = models.OneToOneField('Transaction', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'debts'


class ScheduledTransaction(models.Model):
    """
    Represents a scheduled transaction that repeats periodically.

    Attributes:
        id_transaction: Auto-incrementing primary key for each scheduled transaction.
        user: Foreign key relation to the User model, linking the scheduled transaction to a specific user.
        amount: The monetary amount for the scheduled transaction.
        description: A brief description of the scheduled transaction (optional).
        type: Specifies whether the scheduled transaction is an income or expense.
        categories: Many-to-many relationship with Category model for categorizing scheduled transactions.
        schedule_date: The date on which the scheduled transaction is to occur.
        repeat: Specifies the frequency of repetition for the scheduled transaction (e.g., daily, weekly, etc.).
    """
    id_transaction = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    amount = models.FloatField()
    description = models.CharField(max_length=128, null=True, blank=True)
    type = models.IntegerField(
        choices=Transaction.TransEnum.choices,
        default=Transaction.TransEnum.INCOME
    )
    categories = models.ManyToManyField('Category', related_name='scheduled_transactions')
    schedule_date = models.DateField()
    repeat = models.CharField(
        max_length=10,
        choices=[('none', 'None'), ('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly'),  ('yearly', 'Yearly')],
        default='none'
    )

    class Meta:
        db_table = 'scheduled_transactions'

    def __str__(self):
        return f"{self.description} ({self.type}) on {self.schedule_date}"
