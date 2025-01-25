from django.contrib import admin
from .models import Vehicle

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('make', 'model', 'year', 'license_plate', 'owner', 'created_at')
    list_filter = ('make', 'year', 'created_at')
    search_fields = ('make', 'model', 'license_plate', 'chassis_number', 'engine_number')
    raw_id_fields = ('owner',)
    ordering = ('-created_at',)
