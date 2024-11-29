from django.db import models

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

    date = models.DateField(auto_now_add=True)
    categories = models.ManyToManyField('Category', related_name='transactions')
    class Meta:
        db_table = 'transactions'

class Category(models.Model):
    id_category = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=35, unique=True)
    is_universal = models.BooleanField(default=False)
    class Meta:
        db_table = 'categories'

class Debts(models.Model):
    id_debts = models.AutoField(primary_key=True)
    id_user = models.ForeignKey('User', on_delete=models.CASCADE)
    mount = models.FloatField()
    description = models.CharField(max_length=128, null=True, blank=True)
    lender = models.CharField(max_length=35, unique=True)
    hasInterest = models.BooleanField(default=False)
    interestAmount = models.FloatField(default=0)
    init_date = models.DateField()
    due_date = models.DateField()
    paid_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=32, 
        choices=[('pending', 'Pending'), ('paid', 'Paid'), ('overdue', 'Overdue')], 
        default='pending'
    )
    class Meta:
        db_table = 'debts'