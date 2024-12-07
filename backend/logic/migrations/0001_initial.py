# Generated by Django 4.2.17 on 2024-12-07 23:12

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id_category', models.AutoField(primary_key=True, serialize=False)),
                ('category_name', models.CharField(max_length=35, unique=True)),
                ('is_universal', models.BooleanField(default=False)),
            ],
            options={
                'db_table': 'categories',
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id_user', models.AutoField(primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=128)),
                ('first_name', models.CharField(max_length=50, null=True)),
                ('last_name_father', models.CharField(max_length=50, null=True)),
                ('last_name_mother', models.CharField(blank=True, max_length=50, null=True)),
                ('tax_address', models.CharField(max_length=255, null=True)),
                ('curp', models.CharField(max_length=18, null=True, unique=True)),
                ('rfc', models.CharField(max_length=13, null=True, unique=True)),
                ('phone_number', models.CharField(blank=True, max_length=15, null=True)),
                ('marital_status', models.CharField(choices=[('single', 'single'), ('married', 'married'), ('divorced', 'divorced'), ('widowed', 'widowed')], default='single', max_length=10, null=True)),
                ('categories', models.ManyToManyField(related_name='users', to='logic.category')),
            ],
            options={
                'db_table': 'users',
            },
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id_transaction', models.AutoField(primary_key=True, serialize=False)),
                ('mount', models.FloatField()),
                ('description', models.CharField(blank=True, max_length=128, null=True)),
                ('type', models.IntegerField(choices=[(0, 'Income'), (1, 'Expense')], default=0)),
                ('date', models.DateTimeField(default=django.utils.timezone.now)),
                ('categories', models.ManyToManyField(related_name='transactions', to='logic.category')),
                ('id_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='logic.user')),
            ],
            options={
                'db_table': 'transactions',
            },
        ),
        migrations.CreateModel(
            name='ScheduledTransaction',
            fields=[
                ('id_transaction', models.AutoField(primary_key=True, serialize=False)),
                ('amount', models.FloatField()),
                ('description', models.CharField(blank=True, max_length=128, null=True)),
                ('type', models.IntegerField(choices=[(0, 'Income'), (1, 'Expense')], default=0)),
                ('schedule_date', models.DateField()),
                ('repeat', models.CharField(choices=[('none', 'None'), ('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly')], default='none', max_length=10)),
                ('categories', models.ManyToManyField(related_name='scheduled_transactions', to='logic.category')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='logic.user')),
            ],
            options={
                'db_table': 'scheduled_transactions',
            },
        ),
    ]
