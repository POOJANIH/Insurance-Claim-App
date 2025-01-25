from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CaseViewSet, validate_vehicle, create_unregistered_case

router = DefaultRouter()
router.register(r'', CaseViewSet)

urlpatterns = [
    path('unregistered/validate-vehicle/', validate_vehicle, name='validate-vehicle'),
    path('unregistered/create/', create_unregistered_case, name='create-unregistered-case'),
    path('', include(router.urls)),
] 