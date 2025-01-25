from rest_framework import serializers
from .models import Case
from vehicles.serializers import VehicleSerializer
from garages.serializers import GarageSerializer

class CaseSerializer(serializers.ModelSerializer):
    vehicle_details = VehicleSerializer(source='vehicle', read_only=True)
    garage_details = GarageSerializer(source='garage', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Case
        fields = (
            'id', 'case_name', 'case_status', 'user', 'user_email', 'user_name',
            'vehicle', 'vehicle_details', 'accident_photos', 'accident_date',
            'accident_time', 'accident_location', 'weather_conditions',
            'number_of_vehicles', 'injuries', 'police_report', 'witness',
            'description', 'case_severity', 'claim_form', 'garage',
            'garage_details', 'estimate_file', 'case_created_at', 'case_updated_at'
        )
        read_only_fields = ('id', 'case_name', 'case_created_at', 'case_updated_at', 'user')

    def validate_accident_photos(self, value):
        required_angles = ['front', 'back', 'left', 'right', 'damage']
        for angle in required_angles:
            if angle not in value or not value[angle]:
                raise serializers.ValidationError(f"Photo from {angle} angle is required")
        return value

class CaseUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = ('case_status', 'case_severity', 'garage', 'estimate_file', 'claim_form')
        read_only_fields = ('id', 'case_created_at', 'case_updated_at') 