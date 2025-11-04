from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.accounts.serializers import RegisterFormSerializer
from apps.activity_log.models import ActivityLog
from apps.activity_log.serializers import ActivityLogSerializer
from apps.activity_log.utils import log_activity
from apps.core.models import Class, Subject

from .pagination import UserPagination
from .permissions import IsAdmin
from .serializers import GetUsersSerializer

User = get_user_model()


# Admin User Creation View
class CreateUserView(generics.CreateAPIView):
    permission_classes = [IsAdmin]
    queryset = User.objects.all()
    serializer_class = RegisterFormSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        log_activity(user, 'User Creation', f'User {user.username} was created by Admin.', content_object=user)


# Get All Users View
class GetAllUsers(generics.ListAPIView):
    serializer_class = GetUsersSerializer
    queryset = User.objects.all().order_by('-date_joined')
    pagination_class = UserPagination


# Admin Dashboard View
class Dashboard(APIView):
    def get(self, request, *args, **kwargs):
        total_users = User.objects.exclude(role='Admin').count()
        total_teachers = User.objects.filter(role='Teacher').count()
        total_students = User.objects.filter(role='Student').count()
        total_classes = Class.objects.count()
        total_subjects = Subject.objects.count()

        recent_users = User.objects.all().exclude(role='Admin').order_by('-date_joined')[:10]
        recent_users_serializer = GetUsersSerializer(recent_users, many=True)

        # Fetch recent activity logs
        recent_activities = ActivityLog.objects.all().order_by('-timestamp')[:10]
        recent_activities_serializer = ActivityLogSerializer(recent_activities, many=True)

        data = {
            'totalUsers': total_users,
            'totalTeachers': total_teachers,
            'totalStudents': total_students,
            'totalSubjects': total_subjects,
            'totalClasses': total_classes,
            'recentUsers': recent_users_serializer.data,
            'recentActivities': recent_activities_serializer.data
        }

        return Response(data)
