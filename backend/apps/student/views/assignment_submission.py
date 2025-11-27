from rest_framework import generics
from apps.core.models import AssignmentSubmission
from apps.student.serializers.assignment_submission import (
    AssignmentSubmissionCreateSerializer,
    AssignmentSubmissionListSerializer,
)
from apps.student.permissions import RoleRequiredPermission

class AssignmentSubmissionListCreateView(generics.ListCreateAPIView):
    queryset = AssignmentSubmission.objects.all()
    permission_classes = [RoleRequiredPermission]
    allowed_roles = ['Student']
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return AssignmentSubmissionCreateSerializer
        return AssignmentSubmissionListSerializer

    def get_queryset(self):
        return AssignmentSubmission.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save()