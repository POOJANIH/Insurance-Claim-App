# api/urls.py
from django.urls import path
from .views import VehicleListView, UserRegistrationView
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('vehicles/', VehicleListView.as_view(), name='vehicle-list'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('vehicles/', VehicleListView.as_view(), name='vehicle-list'),
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
]
