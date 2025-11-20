from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.teacher.serializers.Assignment import (
    AssignmentCreateSerializer,
    AssignmentListSerializer,
    ClassListSerializer,
    SubjectNestedSerializer,
)
from apps.core.models import Assignment, Class, Subject
from apps.teacher.permissions import RoleRequiredPermission


class AssignmentView(APIView):
    permission_classes = [RoleRequiredPermission]
    allowed_roles = ["Teacher", "Admin"]

    def get(self, request):
        try:
            assignment_objects = Assignment.objects.filter(teacher=request.user)
            serializer = AssignmentListSerializer(assignment_objects, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Assignment.DoesNotExist:
            return Response({"error": "Assignments not found."}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        serializer = AssignmentCreateSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            assignment = serializer.save()
            return Response({"assignment": assignment.id})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------------------------------

# GET TEACHER'S CLASSES VIEW - ASSIGNMENT VIEW
class ClassesSubjectsView(APIView):
    permission_classes = [RoleRequiredPermission]
    allowed_roles = ["Teacher", "Admin"]

    def get(self, request):
        try:
            class_object = Class.objects.filter(teachers=request.user)
            subject_object = Subject.objects.filter(classes__in=class_object).distinct()
            class_serialized = ClassListSerializer(class_object, many=True)
            subject_serialized = SubjectNestedSerializer(subject_object, many=True)
            context = {
                "classes": class_serialized.data,
                "subjects": subject_serialized.data
            }
            return Response(context, status=status.HTTP_200_OK)
        except Class.DoesNotExist:
            return Response({"error": "Class not found."}, status=status.HTTP_404_NOT_FOUND)
        

