# Generated by Django 5.1.2 on 2024-11-08 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logic', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='curp',
            field=models.CharField(max_length=18, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='user',
            name='first_name',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='last_name_father',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='last_name_mother',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='marital_status',
            field=models.CharField(choices=[('single', 'single'), ('married', 'married'), ('divorced', 'divorced'), ('widowed', 'widowed')], default='single', max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='phone_number',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='rfc',
            field=models.CharField(max_length=13, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='user',
            name='tax_address',
            field=models.CharField(max_length=255, null=True),
        ),
    ]