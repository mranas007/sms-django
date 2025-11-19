from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.teacher.serializers.TeacherDashboard import TeacherDashboardSerializer
from apps.teacher.permissions import RoleRequiredPermission
from apps.core.models import Class



class TeacherDashboard(APIView):
    permission_classes = [RoleRequiredPermission]
    allowed_roles = ['Teacher', 'Admin']

    def get(self, request):
        user = request.user
        teacherClass = Class.objects.filter(teachers=user)
        serialized = TeacherDashboardSerializer(teacherClass, many=True)
        return Response(serialized.data, status=status.HTTP_200_OK)