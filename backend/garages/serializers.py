from rest_framework import serializers
from .models import Garage

class GarageSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Garage
        fields = ('id', 'name', 'address', 'contact_number', 'email',
                 'user', 'user_email', 'user_name', 'is_active',
                 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at', 'user') 