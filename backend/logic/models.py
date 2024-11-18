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
    category = models.ManyToManyField('Category', related_name='transactions')
    class Meta:
        db_table = 'transactions'

class Category(models.Model):
    id_category = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=35, null=False, blank=False, unique=True)
    class Meta:
        db_table = 'categories'
