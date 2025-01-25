from rest_framework import serializers
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)

    class Meta:
        model = Vehicle
        fields = ('id', 'make', 'model', 'year', 'chassis_number', 
                 'engine_number', 'license_plate', 'vehicle_photos', 
                 'owner', 'owner_email', 'owner_name', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at', 'owner')

    def validate_vehicle_photos(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Vehicle photos must be a list of UUIDs")
        return value 