# Generated by Django 4.2.17 on 2024-12-08 22:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logic', '0002_remove_scheduledtransaction_categories'),
    ]

    operations = [
        migrations.AddField(
            model_name='scheduledtransaction',
            name='categories',
            field=models.ManyToManyField(related_name='scheduled_transactions', to='logic.category'),
        ),
    ]
