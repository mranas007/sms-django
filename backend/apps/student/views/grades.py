from rest_framework import generics

from apps.core.models import AssignmentSubmission
from apps.student.serializers.assignment_submission import AssignmentSubmissionListSerializer
from rest_framework import generics

from apps.core.models import AssignmentSubmission
from apps.student.serializers.assignment_submission import AssignmentSubmissionListSerializer
from apps.core.permissions import RoleRequiredPermission


class GradesView(generics.ListAPIView):
    permission_classes = [RoleRequiredPermission]
    allowed_roles = ['Student']
    serializer_class = AssignmentSubmissionListSerializer


    def get_queryset(self):
        return AssignmentSubmission.objects.filter(
            student=self.request.user, 
            grade__isnull=False
        ).select_related("assignment", "assignment__subject")