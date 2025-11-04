from rest_framework import serializers
from .models import ActivityLog

class ActivityLogSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    content_object_str = serializers.SerializerMethodField()

    class Meta:
        model = ActivityLog
        fields = ['id', 'user_username', 'action_type', 'timestamp', 'message', 'content_object_str']

    def get_content_object_str(self, obj):
        if obj.content_object:
            return str(obj.content_object)
        return None