from rest_framework import generics

from apps.core.models import Class
from apps.student.serializers.classes import ClassListSerializer
from apps.student.permissions import RoleRequiredPermission



class ClassDetail(generics.ListAPIView):
    permission_classes = [RoleRequiredPermission]
    allowed_roles = ['Student']
    serializer_class = ClassListSerializer

    def get_queryset(self):
        return Class.objects.filter(students=self.request.user)
        

