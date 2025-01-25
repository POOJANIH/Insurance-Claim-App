from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import File
from .serializers import FileSerializer

# Create your views here.

class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_context(self):
        """
        Extra context provided to the serializer class.
        """
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        file_obj = self.request.FILES.get('file')
        if not file_obj:
            raise FileSerializer.ValidationError({'file': 'No file was submitted'})

        # Set the file size and original name
        serializer.save(
            size=file_obj.size,
            original_name=file_obj.name,
            mime_type=file_obj.content_type
        )

    def get_queryset(self):
        """
        Filter files based on type if specified in query params
        """
        queryset = File.objects.all()
        file_type = self.request.query_params.get('type', None)
        if file_type is not None:
            queryset = queryset.filter(file_type=file_type)
        return queryset

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def templates(self, request):
        """
        List all available claim form templates
        """
        templates = File.objects.filter(file_type=File.FileType.CLAIM_FORM_TEMPLATE)
        serializer = FileSerializer(templates, many=True, context={'request': request})
        return Response(serializer.data)