from rest_framework import serializers
from .models import File

class FileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = ('id', 'file', 'file_url', 'file_type', 'original_name',
                 'mime_type', 'size', 'uploaded_at')
        read_only_fields = ('id', 'file_url', 'size', 'uploaded_at', 'original_name', 'mime_type')

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url') and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    def validate_file(self, value):
        # 10MB limit
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 10MB")
        return value 