from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Vehicle
from .serializers import VehicleSerializer
from cases.serializers import CaseSerializer

# Create your views here.

class IsOwnerOrStaff(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.owner == request.user

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['Admin', 'InsuranceStaff']:
            return Vehicle.objects.all()
        return Vehicle.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'])
    def add_photos(self, request, pk=None):
        vehicle = self.get_object()
        photos = request.data.get('photos', [])
        if not isinstance(photos, list):
            return Response({'error': 'Photos must be a list of UUIDs'}, 
                          status=400)
        
        current_photos = vehicle.vehicle_photos
        current_photos.extend(photos)
        vehicle.vehicle_photos = current_photos
        vehicle.save()
        
        serializer = self.get_serializer(vehicle)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def profile(self, request, pk=None):
        """
        Get vehicle profile including its details and case history
        """
        vehicle = self.get_object()
        vehicle_data = self.get_serializer(vehicle).data
        
        # Get all cases for this vehicle
        cases = vehicle.cases.all().order_by('-case_created_at')
        case_data = CaseSerializer(cases, many=True).data
        
        return Response({
            'vehicle': vehicle_data,
            'cases': case_data
        })
