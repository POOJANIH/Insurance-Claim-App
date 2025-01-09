from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Vehicle, UserProfile
import qrcode
from io import BytesIO
import base64

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['full_name', 'email', 'phone_number', 'role']  # Adjust fields as needed

class UserRegistrationSerializer(serializers.ModelSerializer):
    user_profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['username', 'password', 'user_profile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user_profile_data = validated_data.pop('user_profile')
        user = User(**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        
        user_profile = UserProfile.objects.create(user=user, **user_profile_data)

        # Generate a QR code for the user profile
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(user_profile.id)  # You can add any data you want here
        qr.make(fit=True)

        # Save QR code image as base64
        img = qr.make_image(fill_color="black", back_color="white")
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        qr_code_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

        # Update the user profile with the QR code
        user_profile.qr_code = qr_code_base64
        user_profile.save()

        return user
