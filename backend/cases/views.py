from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Case
from vehicles.models import Vehicle
from .serializers import CaseSerializer, CaseUpdateSerializer
from core.models import File

# Create your views here.

class IsCaseParticipant(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return (user.is_staff or 
                user == obj.user or 
                (user.role == 'Garage' and obj.garage and obj.garage.user == user))

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def validate_vehicle(request):
    """
    Endpoint for unregistered users to validate vehicle license plate before creating a case
    """
    print("=== Starting vehicle validation ===")
    print(f"Request data: {request.data}")
    
    license_plate = request.data.get('license_plate')
    print(f"License plate to validate: {license_plate}")
    
    if not license_plate:
        print("Error: No license plate provided")
        return Response(
            {'error': 'Vehicle license plate is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        print(f"Searching for vehicle with license plate: {license_plate}")
        vehicle = Vehicle.objects.get(license_plate=license_plate)
        print(f"Found vehicle: {vehicle.make} {vehicle.model} ({vehicle.year})")
        return Response({
            'valid': True,
            'vehicle': {
                'make': vehicle.make,
                'model': vehicle.model,
                'year': vehicle.year,
                'license_plate': vehicle.license_plate
            }
        })
    except Vehicle.DoesNotExist:
        print(f"No vehicle found with license plate: {license_plate}")
        return Response({
            'valid': False,
            'error': 'Vehicle not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def create_unregistered_case(request):
    """
    Endpoint for unregistered users to create a case using vehicle number
    """
    print("=== Starting unregistered case creation ===")
    print(f"Request data: {request.data}")
    
    license_plate = request.data.get('license_plate')
    print(f"License plate: {license_plate}")
    
    if not license_plate:
        print("Error: No license plate provided")
        return Response(
            {'error': 'Vehicle license plate is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    # Find vehicle by license plate
    try:
        print(f"Searching for vehicle with license plate: {license_plate}")
        vehicle = Vehicle.objects.get(license_plate=license_plate)
        print(f"Found vehicle: {vehicle.id} - Owner: {vehicle.owner.email}")
    except Vehicle.DoesNotExist:
        print(f"No vehicle found with license plate: {license_plate}")
        return Response(
            {'error': 'Vehicle not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

    # Create case with provided data
    case_data = {
        'vehicle': vehicle.id,
        'accident_photos': request.data.get('accident_photos', {}),
        'accident_date': request.data.get('accident_date'),
        'accident_time': request.data.get('accident_time'),
        'accident_location': request.data.get('accident_location'),
        'weather_conditions': request.data.get('weather_conditions'),
        'number_of_vehicles': request.data.get('number_of_vehicles'),
        'injuries': request.data.get('injuries', False),
        'police_report': request.data.get('police_report', False),
        'witness': request.data.get('witness', False),
        'description': request.data.get('description', ''),
        'case_status': Case.Status.ACCIDENT_REPORT,
        'case_severity': request.data.get('case_severity')
    }
    print(f"Prepared case data: {case_data}")

    serializer = CaseSerializer(data=case_data)
    print(f"Checking serializer validity...")
    if serializer.is_valid():
        print("Serializer is valid, saving case...")
        try:
            case = serializer.save(user=vehicle.owner)
            print(f"Case created successfully with ID: {case.id}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error saving case: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    print(f"Serializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    permission_classes = [permissions.IsAuthenticated, IsCaseParticipant]

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return CaseUpdateSerializer
        return CaseSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'Admin':
            return Case.objects.all()
        elif user.role == 'InsuranceStaff':
            return Case.objects.all()
        elif user.role == 'Garage':
            return Case.objects.filter(garage__user=user)
        return Case.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def upload_claim_form(self, request, pk=None):
        case = self.get_object()
        claim_form_uuid = request.data.get('claim_form_uuid')
        
        if not claim_form_uuid:
            return Response({'error': 'Claim form UUID is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        case.claim_form = claim_form_uuid
        case.case_status = Case.Status.CLAIM_CREATED
        case.save()
        
        serializer = self.get_serializer(case)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def assign_garage(self, request, pk=None):
        if request.user.role not in ['Admin', 'InsuranceStaff']:
            return Response({'error': 'Only staff can assign garages'}, 
                          status=status.HTTP_403_FORBIDDEN)

        case = self.get_object()
        garage_id = request.data.get('garage_id')
        
        if not garage_id:
            return Response({'error': 'Garage ID is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        case.garage_id = garage_id
        case.case_status = Case.Status.CLAIM_ASSIGNED_TO_GARAGE
        case.save()
        
        serializer = self.get_serializer(case)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def submit_estimate(self, request, pk=None):
        if request.user.role != 'Garage':
            return Response({'error': 'Only garages can submit estimates'}, 
                          status=status.HTTP_403_FORBIDDEN)

        case = self.get_object()
        estimate_file_uuid = request.data.get('estimate_file_uuid')
        
        if not estimate_file_uuid:
            return Response({'error': 'Estimate file UUID is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        case.estimate_file = estimate_file_uuid
        case.case_status = Case.Status.CLAIM_ESTIMATE_GIVEN_BY_GARAGE
        case.save()
        
        serializer = self.get_serializer(case)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def evaluate_severity(self, request, pk=None):
        if request.user.role not in ['Admin', 'InsuranceStaff']:
            return Response({'error': 'Only staff can evaluate severity'}, 
                          status=status.HTTP_403_FORBIDDEN)

        case = self.get_object()
        severity = request.data.get('severity')
        
        if severity not in [Case.Severity.MINOR, Case.Severity.MAJOR]:
            return Response({'error': 'Invalid severity value'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        case.case_severity = severity
        case.case_status = Case.Status.ACCIDENT_REPORT_EVALUATED
        case.save()
        
        serializer = self.get_serializer(case)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def estimate_details(self, request, pk=None):
        """
        Get detailed estimate information for a case
        """
        case = self.get_object()
        if not case.garage or not case.estimate_file:
            return Response(
                {'error': 'No estimate available for this case'}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        data = {
            'case_id': case.id,
            'case_name': case.case_name,
            'garage_name': case.garage.name,
            'garage_contact': case.garage.contact_number,
            'estimate_file_uuid': case.estimate_file,
            'status': case.case_status,
            'last_updated': case.case_updated_at
        }
        
        return Response(data)
