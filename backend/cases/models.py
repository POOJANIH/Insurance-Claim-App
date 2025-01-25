from django.db import models
from django.conf import settings
import uuid

class Case(models.Model):
    class Status(models.TextChoices):
        ACCIDENT_REPORT = 'ACCIDENT_REPORT', 'Accident Report'
        ACCIDENT_REPORT_EVALUATED = 'ACCIDENT_REPORT_EVALUATED', 'Accident Report Evaluated'
        CLAIM_CREATED = 'CLAIM_CREATED', 'Claim Created'
        CLAIM_ASSIGNED_TO_GARAGE = 'CLAIM_ASSIGNED_TO_GARAGE', 'Claim Assigned to Garage'
        CLAIM_ESTIMATE_GIVEN_BY_GARAGE = 'CLAIM_ESTIMATE_GIVEN_BY_GARAGE', 'Claim Estimate Given by Garage'

    class Severity(models.TextChoices):
        MINOR = 'MINOR', 'Minor'
        MAJOR = 'MAJOR', 'Major'

    class WeatherCondition(models.TextChoices):
        CLEAR = 'CLEAR', 'Clear'
        RAINY = 'RAINY', 'Rainy'
        FOGGY = 'FOGGY', 'Foggy'
        SNOWY = 'SNOWY', 'Snowy'
        OTHER = 'OTHER', 'Other'

    # Basic Information
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case_name = models.CharField(max_length=255)
    case_status = models.CharField(max_length=50, choices=Status.choices, default=Status.ACCIDENT_REPORT)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cases')
    vehicle = models.ForeignKey('vehicles.Vehicle', on_delete=models.CASCADE, related_name='cases')

    # Accident Report Fields
    accident_photos = models.JSONField(default=dict)  # JSON Map of UUIDs for different angles
    accident_date = models.DateField()
    accident_time = models.TimeField()
    accident_location = models.CharField(max_length=255)
    weather_conditions = models.CharField(max_length=20, choices=WeatherCondition.choices)
    number_of_vehicles = models.IntegerField()
    injuries = models.BooleanField(default=False)
    police_report = models.BooleanField(default=False)
    witness = models.BooleanField(default=False)
    description = models.TextField()
    case_severity = models.CharField(max_length=20, choices=Severity.choices)

    # Claim Form
    claim_form = models.UUIDField(null=True, blank=True)  # UUID of the uploaded claim form

    # Garage Fields
    garage = models.ForeignKey('garages.Garage', on_delete=models.SET_NULL, null=True, blank=True, related_name='cases')
    estimate_file = models.UUIDField(null=True, blank=True)  # UUID of the uploaded estimate file (PDF/PNG)

    # Timestamps
    case_created_at = models.DateTimeField(auto_now_add=True)
    case_updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'cases'
        verbose_name = 'case'
        verbose_name_plural = 'cases'
        ordering = ['-case_created_at']

    def __str__(self):
        return f"{self.case_name} - {self.case_status}"

    def save(self, *args, **kwargs):
        if not self.case_name and self.vehicle and self.accident_date and self.accident_time:
            self.case_name = f"{self.vehicle.license_plate} - {self.accident_date} - {self.accident_time}"
        super().save(*args, **kwargs)
