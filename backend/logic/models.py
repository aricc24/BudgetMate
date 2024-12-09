from django.db import models
from django.utils import timezone
from django.utils.timezone import now


# Create your models here.

class User(models.Model):
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
    email_schedule_start_date = models.DateField(default=now().date)
    class Meta:
        db_table = 'users'

class Transaction(models.Model):
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
    id_category = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=35, unique=True)
    is_universal = models.BooleanField(default=False)
    class Meta:
        db_table = 'categories'

class Debt(models.Model):
    id_debt = models.AutoField(primary_key=True)
    id_user = models.ForeignKey('User', on_delete=models.CASCADE)
    amount = models.FloatField()
    description = models.CharField(max_length=128, null=True, blank=True)
    lender = models.CharField(max_length=35, null=True, blank=True)
    hasInterest = models.BooleanField(default=False)
    interestAmount = models.FloatField(default=0.0)
    totalAmount = models.FloatField()
    init_date = models.DateTimeField(default=timezone.now)
    due_date = models.DateTimeField(default=timezone.now)
    class StatusEnum(models.IntegerChoices):
        PENDING =  0, 'Pending'
        PAID =  1, 'Paid'
        OVERDUE = 2, 'Overdue'

    status = models.IntegerField(
        choices=StatusEnum.choices,
        default=StatusEnum.PENDING
    )
    class Meta:
        db_table = 'debts'

class ScheduledTransaction(models.Model):
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
        choices=[('none', 'None'), ('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly')],
        default='none'
    )

    class Meta:
        db_table = 'scheduled_transactions'

    def __str__(self):
        return f"{self.description} ({self.type}) on {self.schedule_date}"
