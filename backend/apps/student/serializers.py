from rest_framework import serializers

class StudentDashboardSerializer(serializers.Serializer):
    # Add fields if you need to serialize data for the student dashboard
    user = serializers.CharField(read_only=True)