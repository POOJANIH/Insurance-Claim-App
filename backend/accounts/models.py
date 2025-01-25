from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER = 'Customer', _('Customer')
        ADMIN = 'Admin', _('Admin')
        GARAGE = 'Garage', _('Garage')
        INSURANCE_STAFF = 'InsuranceStaff', _('Insurance Staff')

    email = models.EmailField(_('email address'), unique=True)
    phone_number = models.CharField(max_length=15)
    role = models.CharField(max_length=20, choices=Role.choices)
    nic = models.CharField(max_length=255, unique=True, null=True, blank=True)
    dl_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'phone_number', 'role']

    class Meta:
        db_table = 'users'
        verbose_name = _('user')
        verbose_name_plural = _('users')
