from rest_framework import generics
from apps.teacher.serializers.students import StudentListSerializer
from apps.core.models import User, Class
from apps.teacher.permissions import RoleRequiredPermission




class StudentView(generics.ListAPIView):
    """
    A ListAPIView for Teachers viewing their students.
    """

    permission_classes = [RoleRequiredPermission]
    allowed_roles = ["Teacher"]
    serializer_class = StudentListSerializer

    def get_queryset(self):
        teacher = self.request.user
        teacher_classes = Class.objects.filter(teachers=teacher)
        students = User.objects.filter(
            classes_as_student__in=teacher_classes, role="Student"
        ).distinct()

        return students
