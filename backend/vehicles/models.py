from django.db import models
from django.conf import settings
import uuid

class Vehicle(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    make = models.CharField(max_length=255)
    model = models.CharField(max_length=100, null=True, blank=True)
    year = models.IntegerField(null=True, blank=True)
    chassis_number = models.CharField(max_length=50, unique=True, null=True, blank=True)
    engine_number = models.CharField(max_length=50, unique=True, null=True, blank=True)
    license_plate = models.CharField(max_length=20, unique=True)
    vehicle_photos = models.JSONField(default=list)  # Array of UUIDs
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vehicles')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vehicles'
        verbose_name = 'vehicle'
        verbose_name_plural = 'vehicles'

    def __str__(self):
        return f"{self.make} - {self.license_plate}"
