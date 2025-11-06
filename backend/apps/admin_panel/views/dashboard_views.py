from rest_framework.views import APIView
from rest_framework.response import Response
from apps.admin_panel.permissions import IsAdmin
from apps.core.models import Class, Subject
from apps.accounts.models import User
from apps.activity_log.models import ActivityLog
from apps.activity_log.serializers import ActivityLogSerializer

class Dashboard(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        total_classes = Class.objects.count()
        total_users = User.objects.exclude(role='Admin').count()
        total_subjects = Subject.objects.count()
        total_teachers = User.objects.filter(role='Teacher').count()
        total_students = User.objects.filter(role='Student').count()

        activities = ActivityLog.objects.all().order_by('-timestamp')[:10]
        recent_activities = ActivityLogSerializer(activities, many=True)
        
        data = {
            'total_users': total_users,
            'total_teachers': total_teachers,
            'total_students': total_students,
            'total_subjects': total_subjects,
            'total_classes': total_classes,
            'recent_activities': recent_activities.data
        }
        return Response(data)