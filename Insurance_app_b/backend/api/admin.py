# backend/api/admin.py

from django.contrib import admin
from .models import UserProfile, Vehicle, Claim, Photo, Garage, GarageQuote, Notification, Admin

admin.site.register(UserProfile)
admin.site.register(Vehicle)
admin.site.register(Claim)
admin.site.register(Photo)
admin.site.register(Garage)
admin.site.register(GarageQuote)
admin.site.register(Notification)
admin.site.register(Admin)
