from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.generics import get_object_or_404

from apps.core.models import Class
from apps.activity_log.utils import log_activity
from apps.admin_panel.permissions import IsAdmin
from apps.admin_panel.serializers.class_serializers import ClassListSerializer, ClassCreateSerializer
from apps.admin_panel.pagination import UserPagination



# Class: Read all, Create
class ClassCR(APIView):
    permission_classes = [IsAdmin]
    pagination_class = UserPagination
    queryset = Class.objects.all()

    def get_queryset(self):
        return Class.objects.all()

    def get(self, request, *args, **kwargs):
        classes = self.get_queryset()
        pagination = self.pagination_class()
        paginated_classes = pagination.paginate_queryset(classes, request)
        serializer = ClassListSerializer(paginated_classes, many=True)
        return pagination.get_paginated_response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = ClassCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        class_instance = serializer.save()
        log_activity(self.request.user, 'Class Creation', f'Class {class_instance.name} was created by Admin.', content_object=class_instance)
        return Response(serializer.data)


# Class: Read one, Update, Delete
class ClassRUD(APIView):
    permission_classes = [IsAdmin]
    
    def get(self, request, pk, *args, **kwargs):
        class_instance = get_object_or_404(Class, pk=pk)
        serializer = ClassListSerializer(class_instance)
        return Response(serializer.data)

    def put(self, request, pk, *args, **kwargs):
        class_instance = get_object_or_404(Class, pk=pk)
        serializer = ClassCreateSerializer(class_instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        log_activity(self.request.user, 'Class Update', f'Class {class_instance.name} was updated by Admin.', content_object=class_instance)
        return Response(serializer.data)

    def delete(self, request, pk, *args, **kwargs):
        class_instance = get_object_or_404(Class, pk=pk)
        class_instance.delete()
        log_activity(self.request.user, 'Class Deletion', f'Class {class_instance.name} was deleted by Admin.', content_object=class_instance)
        return Response({'message': 'Class deleted successfully'})


