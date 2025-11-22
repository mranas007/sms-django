from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from apps.core.models import Class
from apps.student.serializers.classes import ClassListSerializer



class ClassDetail(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    allowed_roles = ['Student', 'Admin']
    serializer_class = ClassListSerializer

    def get_queryset(self):
        return Class.objects.filter(students=self.request.user)
        

