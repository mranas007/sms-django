from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from apps.core.models import AssignmentSubmission
from apps.student.serializers.assignment_submission import AssignmentSubmissionListSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from apps.core.models import AssignmentSubmission
from apps.student.serializers.assignment_submission import AssignmentSubmissionListSerializer

class GradesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AssignmentSubmissionListSerializer


    def get_queryset(self):
        return AssignmentSubmission.objects.filter(
            student=self.request.user, 
            grade__isnull=False
        ).select_related("assignment", "assignment__subject")