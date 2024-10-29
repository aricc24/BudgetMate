from django.db import models

class User(models.Model):
    id_user = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    contraseña = models.CharField(max_length=128)

    class Meta:
        db_table = 'users'