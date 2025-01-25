from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from garages.models import Garage

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password2', 'phone_number', 
                 'role', 'nic', 'dl_number', 'date_created', 'first_name', 'last_name')
        read_only_fields = ('id', 'date_created')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone_number', 'nic', 
                 'dl_number', 'first_name', 'last_name')
        read_only_fields = ('id', 'email')

class GarageDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Garage
        fields = ['id', 'name', 'address', 'contact_number', 'is_active']

class UserDetailsSerializer(serializers.ModelSerializer):
    garage_details = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'role', 'phone_number', 'is_staff', 'is_superuser',
            'nic', 'dl_number', 'garage_details'
        ]

    def get_garage_details(self, obj):
        if obj.role == 'Garage' and hasattr(obj, 'garage_profile'):
            return GarageDetailsSerializer(obj.garage_profile).data
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Remove null fields and role-specific fields
        if instance.role != 'Customer':
            data.pop('nic', None)
            data.pop('dl_number', None)
        if instance.role != 'Garage':
            data.pop('garage_details', None)
        if instance.role not in ['Admin', 'InsuranceStaff']:
            data.pop('is_staff', None)
        if instance.role != 'Admin':
            data.pop('is_superuser', None)
        return data 