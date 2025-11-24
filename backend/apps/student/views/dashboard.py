from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.student.permissions import RoleRequiredPermission
from apps.student.serializers.StudentDashboard import StudentDashboardSerializer
from apps.core.models import Class


class StudentDashboard(APIView):
    permission_classes = [RoleRequiredPermission]
    allowed_roles = ['Student']
    
    # Note: APIView doesn't automatically use this, but it's good for documentation
    serializer_class = StudentDashboardSerializer

    def get(self, request):
        # 1. Fix: Use the correct field name 'students' (plural)
        user = request.user
        student_classes = Class.objects.filter(students=user)
        
        # 2. Fix: Add 'many=True' because filter returns a list, not one item
        serializer = StudentDashboardSerializer(student_classes, many=True)
        
        # 3. Fix: Return '.data', not the serializer object itself
        return Response(serializer.data, status=status.HTTP_200_OK)