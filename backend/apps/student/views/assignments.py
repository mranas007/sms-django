from rest_framework import generics

from apps.core.models import Assignment, Class
from apps.student.serializers.assignments import AssignmentListSerializer
from apps.student.permissions import RoleRequiredPermission



class AssignmentListView(generics.ListAPIView):
    """
    API view to list all assignments for students.
    """

    permission_classes = [RoleRequiredPermission]
    allowed_roles = ['Student']
    serializer_class = AssignmentListSerializer
    queryset = Assignment.objects.all()

    def get_queryset(self):
        classes = Class.objects.filter(students=self.request.user)
        return self.queryset.filter(class_assigned__in=classes)
    

class AssignmentDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve a specific assignment's details.
    """

    permission_classes = [RoleRequiredPermission]
    allowed_roles = ['Student']
    serializer_class = AssignmentListSerializer
    queryset = Assignment.objects.all()