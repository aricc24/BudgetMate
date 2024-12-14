from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist

class Command(BaseCommand):
    help = 'Creates a superuser if one does not already exist'

    def handle(self, *args, **options):
        username = 'admin'
        email = 'budgetmatesys@gmail.com'
        password = 'budgetmatesys'  

        try:
            user = User.objects.get(username=username)
            self.stdout.write(self.style.SUCCESS(f'Superuser with username {username} already exists'))
        except ObjectDoesNotExist:
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'Superuser created with username {username}'))
