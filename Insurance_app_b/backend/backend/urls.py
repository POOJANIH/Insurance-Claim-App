# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

# Define a simple view for the root URL
def root_view(request):
    return HttpResponse("Welcome to the Backend Root URL")

urlpatterns = [
    path('admin/', admin.site.urls),  # Admin interface
    path('api/', include('api.urls')),  # Include your API URLs
    path('', root_view),  # Handle the root URL
]
