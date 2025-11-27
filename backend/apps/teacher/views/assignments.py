from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.teacher.serializers.Assignment import (
    AssignmentCreateUpdateSerializer,
    AssignmentListSerializer,
    ClassListSerializer,
    SubjectNestedSerializer,
)
from apps.core.models import Assignment, Class, Subject
from apps.teacher.permissions import RoleRequiredPermission


#  ---------------------------------

# ASSIGNMENT VIEW - GET ALL, CREATE
class AssignmentView(APIView):
    permission_classes = [RoleRequiredPermission]
    allowed_roles = ["Teacher"]

    def get(self, request):
        try:
            assignment_objects = Assignment.objects.filter(teacher=request.user)
            serializer = AssignmentListSerializer(assignment_objects, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Assignment.DoesNotExist:
            return Response({"error": "Assignments not found."}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        serializer = AssignmentCreateUpdateSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            assignment = serializer.save()
            return Response({"assignment": assignment.id})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------------------------------

# ASSIGNMENT DETAIL VIEW - GET ONE, DELETE, PUT
class AssignmentDetailView(APIView):
    permission_classes = [RoleRequiredPermission]
    allowed_roles = ["Teacher"]

    def get(self, request, assignment_id):
        try:
            assignment_object = Assignment.objects.get(id=assignment_id, teacher=request.user)
            serializer = AssignmentListSerializer(assignment_object)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Assignment.DoesNotExist:
            return Response({"error": "Assignment not found."}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, assignment_id):
        try:
            assignment_object = Assignment.objects.get(id=assignment_id, teacher=request.user)
            assignment_object.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Assignment.DoesNotExist:
            return Response({"error": "Assignment not found."}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, assignment_id):
        try:
            assignment_object = Assignment.objects.get(id=assignment_id, teacher=request.user)
            serializer = AssignmentCreateUpdateSerializer(assignment_object, data=request.data, context={"request": request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Assignment.DoesNotExist:
            return Response({"error": "Assignment not found."}, status=status.HTTP_404_NOT_FOUND)

# ---------------------------------

# GET TEACHER'S CLASSES VIEW - ASSIGNMENT VIEW
class ClassesSubjectsView(APIView):
    permission_classes = [RoleRequiredPermission]
    allowed_roles = ["Teacher"]

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
        

