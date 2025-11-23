from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from apps.core.models import AssignmentSubmission
from apps.student.serializers.assignment_submission import (
    AssignmentSubmissionCreateSerializer,
    AssignmentSubmissionListSerializer,
)

class AssignmentSubmissionListCreateView(generics.ListCreateAPIView):
    queryset = AssignmentSubmission.objects.all()
    permission_classes = [IsAuthenticated]
    # serializer_class = AssignmentSubmissionListSerializer

    def get_serializer_class(self):
        if self.request.method == "POST":
            return AssignmentSubmissionCreateSerializer
        return AssignmentSubmissionListSerializer

    def get_queryset(self):
        return AssignmentSubmission.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save()