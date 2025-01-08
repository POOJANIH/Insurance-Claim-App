from rest_framework import generics
from .models import Vehicle
from .serializers import VehicleSerializer
from rest_framework.permissions import AllowAny  # Import AllowAny permission class

class VehicleListView(generics.ListAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [AllowAny]  # Public access (no authentication required)
