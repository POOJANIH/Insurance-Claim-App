from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Garage
from .serializers import GarageSerializer

# Create your views here.

class IsGarageOrStaff(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return user.is_staff or (user.role == 'Garage' and obj.user == user)

class GarageViewSet(viewsets.ModelViewSet):
    queryset = Garage.objects.all()
    serializer_class = GarageSerializer
    permission_classes = [permissions.IsAuthenticated, IsGarageOrStaff]

    def get_queryset(self):
        print("=== Starting garage queryset filtering ===")
        user = self.request.user
        print(f"User: {user.email} - Role: {user.role}")
        
        # First check total garages in DB
        all_garages = Garage.objects.all()
        print(f"Total garages in DB: {all_garages.count()}")
        print(f"All garages: {list(all_garages.values('id', 'name', 'is_active'))}")
        
        if user.role in ['Admin', 'InsuranceStaff']:
            print("User is staff - returning all garages")
            return Garage.objects.all()
        elif user.role == 'Garage':
            print(f"User is garage - filtering for user {user.id}")
            garages = Garage.objects.filter(user=user)
            print(f"Found {garages.count()} garages for this user")
            return garages
        print("User is neither staff nor garage - returning empty queryset")
        return Garage.objects.none()

    def perform_create(self, serializer):
        print("=== Attempting to create garage ===")
        print(f"User role: {self.request.user.role}")
        if not self.request.user.role in ['Admin', 'InsuranceStaff']:
            print("Error: User not authorized to create garage")
            return Response({'error': 'Only staff can create garages'}, 
                          status=status.HTTP_403_FORBIDDEN)
        print("Creating new garage...")
        serializer.save()
        print("Garage created successfully")

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        print("=== Attempting to toggle garage status ===")
        print(f"User role: {request.user.role}")
        if request.user.role not in ['Admin', 'InsuranceStaff']:
            print("Error: User not authorized to toggle garage status")
            return Response({'error': 'Only staff can toggle garage status'}, 
                          status=status.HTTP_403_FORBIDDEN)
            
        garage = self.get_object()
        print(f"Current garage status: {garage.is_active}")
        garage.is_active = not garage.is_active
        garage.save()
        print(f"New garage status: {garage.is_active}")
        
        serializer = self.get_serializer(garage)
        return Response(serializer.data)
