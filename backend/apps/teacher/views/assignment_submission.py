from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.http import FileResponse, Http404
from django.conf import settings
import os

from apps.core.models import AssignmentSubmission
from apps.teacher.serializers.assignment_submission import (
    StudentAssignmentListSerializer,
)



# LIST VIEW FOR ALL ASSIGNMENT SUBMISSIONS
class StudentAssignments(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    allowed_roles = ["Teacher"]
    queryset = AssignmentSubmission.objects.all()
    serializer_class = StudentAssignmentListSerializer


# DETAIL VIEW FOR A SPECIFIC ASSIGNMENT SUBMISSION
class StudentAssignmentDetail(generics.RetrieveAPIView, generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    allowed_roles = ["Teacher"]
    queryset = AssignmentSubmission.objects.all()
    serializer_class = StudentAssignmentListSerializer
    lookup_field = "pk"

    def update(self, request, *args, **kwargs):
        submission = self.get_object()
        grade = request.data.get("grade")
        feedback = request.data.get("feedback")

        if grade is not None:
            submission.grade = grade
        if feedback is not None:
            submission.feedback = feedback

        submission.save()
        serializer = self.get_serializer(submission)
        return Response(serializer.data)