from rest_framework import serializers

class TeacherDashboardSerializer(serializers.Serializer):
    # Add fields if you need to serialize data for the teacher dashboard
    user = serializers.CharField(read_only=True)