from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.db import transaction

User = get_user_model()

class Command(BaseCommand):
    help = 'Sets up default users with proper password hashing'

    def handle(self, *args, **kwargs):
        try:
            with transaction.atomic():
                # Load initial data
                self.stdout.write('Loading initial data...')
                call_command('loaddata', 'initial_users', 'initial_vehicles', 'initial_garages')
                
                # Update passwords with proper hashing
                self.stdout.write('Setting up properly hashed passwords...')
                
                # Admin user
                admin = User.objects.get(username='admin')
                admin.set_password('admin123')
                admin.save()
                
                # Customer user
                customer = User.objects.get(username='customer')
                customer.set_password('customer123')
                customer.save()
                
                # Garage user
                garage = User.objects.get(username='garage')
                garage.set_password('garage123')
                garage.save()
                
                # Staff user
                staff = User.objects.get(username='staff')
                staff.set_password('staff123')
                staff.save()
                
                self.stdout.write(self.style.SUCCESS('Successfully set up all default users!'))
                
                # Print login information
                self.stdout.write('\nDefault Users Created:')
                self.stdout.write('1. Admin User')
                self.stdout.write('   Username: admin')
                self.stdout.write('   Password: admin123')
                self.stdout.write('   Email: admin@example.com')
                self.stdout.write('\n2. Customer User')
                self.stdout.write('   Username: customer')
                self.stdout.write('   Password: customer123')
                self.stdout.write('   Email: customer@example.com')
                self.stdout.write('\n3. Garage User')
                self.stdout.write('   Username: garage')
                self.stdout.write('   Password: garage123')
                self.stdout.write('   Email: garage@example.com')
                self.stdout.write('\n4. Insurance Staff User')
                self.stdout.write('   Username: staff')
                self.stdout.write('   Password: staff123')
                self.stdout.write('   Email: staff@example.com')
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
            raise 