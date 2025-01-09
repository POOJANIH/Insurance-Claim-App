# backend/api/models.py

from django.db import models
from django.contrib.auth.models import User

# Users model
from django.db import models
from django.contrib.auth.models import User
import qrcode
from io import BytesIO
from PIL import Image
from django.core.files import File

# Users model
class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('Customer', 'Customer'),
        ('Admin', 'Admin'),
        ('Garage', 'Garage'),
        ('InsuranceStaff', 'InsuranceStaff'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES)
    date_created = models.DateTimeField(auto_now_add=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)

    def save(self, *args, **kwargs):
        # Generate QR Code upon saving the user profile
        if not self.qr_code:
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            # Embed user-specific login link with a token
            qr.add_data(f'http://127.0.0.1:8000/login/?token={self.id}')
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white")
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            file_name = f'{self.user.username}_qr.png'
            self.qr_code.save(file_name, File(buffer), save=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name

# Vehicles model
class Vehicle(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    license_plate = models.CharField(max_length=50, unique=True)
    chassis_number = models.CharField(max_length=100, unique=True)
    engine_number = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"{self.make} {self.model} ({self.license_plate})"

# Claims model
class Claim(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    DAMAGE_SEVERITY_CHOICES = [
        ('Low', 'Low'),
        ('High', 'High'),
    ]

    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    claim_date = models.DateTimeField(auto_now_add=True)
    claim_status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Pending')
    damage_severity = models.CharField(max_length=15, choices=DAMAGE_SEVERITY_CHOICES, blank=True, null=True)
    amount_requested = models.DecimalField(max_digits=10, decimal_places=2)
    amount_approved = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    notes = models.TextField(blank=True)
    last_updated = models.DateTimeField(auto_now=True)

# Photos model
class Photo(models.Model):
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE)
    photo_url = models.TextField()
    upload_date = models.DateTimeField(auto_now_add=True)

# Garages model
class Garage(models.Model):
    garage_name = models.CharField(max_length=255)
    contact_email = models.EmailField(unique=True)
    contact_phone = models.CharField(max_length=15, blank=True)
    address = models.TextField()

# GarageQuotes model
class GarageQuote(models.Model):
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE)
    garage = models.ForeignKey(Garage, on_delete=models.CASCADE)
    quote_amount = models.DecimalField(max_digits=10, decimal_places=2)
    quote_details = models.TextField(blank=True)
    quote_date = models.DateTimeField(auto_now_add=True)

# Notifications model
class Notification(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    message = models.TextField()
    date_sent = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

# Admins model
class Admin(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name
