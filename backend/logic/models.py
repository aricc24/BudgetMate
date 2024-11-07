from django.db import models

# Create your models here.

class User(models.Model):
    id_user = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    
    class Meta:
        db_table = 'users'