from django.contrib import admin
from .models import Garage

@admin.register(Garage)
class GarageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'contact_number', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'email', 'contact_number', 'address')
    raw_id_fields = ('user',)
    ordering = ('-created_at',)
