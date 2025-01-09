from rest_framework import generics
from .models import Vehicle
from .serializers import VehicleSerializer
from rest_framework.permissions import AllowAny  # Import AllowAny permission class
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserRegistrationSerializer


class VehicleListView(generics.ListAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [AllowAny]  # Public access (no authentication required)

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]  # Public access (no authentication required)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)