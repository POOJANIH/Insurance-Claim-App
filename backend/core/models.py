from django.db import models
import uuid
import os

# Create your models here.

class File(models.Model):
    class FileType(models.TextChoices):
        VEHICLE_PHOTO = 'VEHICLE_PHOTO', 'Vehicle Photo'
        ACCIDENT_PHOTO = 'ACCIDENT_PHOTO', 'Accident Photo'
        CLAIM_FORM = 'CLAIM_FORM', 'Claim Form'
        CLAIM_FORM_TEMPLATE = 'CLAIM_FORM_TEMPLATE', 'Claim Form Template'
        ESTIMATE = 'ESTIMATE', 'Garage Estimate'
        OTHER = 'OTHER', 'Other'

    def get_upload_path(instance, filename):
        # Get the file extension
        ext = filename.split('.')[-1]
        # Generate a UUID for the filename
        filename = f"{uuid.uuid4()}.{ext}"
        
        # Choose directory based on file type
        if instance.file_type == File.FileType.VEHICLE_PHOTO:
            return os.path.join('uploads/vehicle_photos', filename)
        elif instance.file_type == File.FileType.ACCIDENT_PHOTO:
            return os.path.join('uploads/accident_photos', filename)
        elif instance.file_type == File.FileType.CLAIM_FORM:
            return os.path.join('uploads/claim_forms', filename)
        elif instance.file_type == File.FileType.CLAIM_FORM_TEMPLATE:
            return os.path.join('uploads/claim_form_templates', filename)
        elif instance.file_type == File.FileType.ESTIMATE:
            return os.path.join('uploads/estimates', filename)
        else:
            return os.path.join('uploads/other', filename)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.FileField(upload_to=get_upload_path)
    file_type = models.CharField(max_length=20, choices=FileType.choices)
    original_name = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=100)
    size = models.IntegerField()  # in bytes
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'files'
        verbose_name = 'file'
        verbose_name_plural = 'files'

    def __str__(self):
        return f"{self.original_name} ({self.file_type})"
