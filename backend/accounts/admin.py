from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'role', 'phone_number', 'is_active', 'date_joined')
    list_filter = ('role', 'is_active', 'date_joined')
    search_fields = ('email', 'username', 'phone_number', 'nic', 'dl_number')
    ordering = ('-date_joined',)
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'role', 'phone_number'),
        }),
        ('Customer Details', {
            'classes': ('wide',),
            'fields': ('nic', 'dl_number'),
        }),
    )
    
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Role & Documents', {'fields': ('role', 'nic', 'dl_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    def get_fieldsets(self, request, obj=None):
        if not obj:  # This is the add form
            if request.GET.get('role') == 'Customer':
                # Show only customer-relevant fields when adding a customer
                return (
                    (None, {
                        'classes': ('wide',),
                        'fields': ('email', 'username', 'password1', 'password2', 'phone_number', 'nic', 'dl_number'),
                    }),
                )
        return super().get_fieldsets(request, obj)
