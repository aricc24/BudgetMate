# Generated by Django 4.2.17 on 2024-12-08 21:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('logic', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='scheduledtransaction',
            name='categories',
        ),
    ]
