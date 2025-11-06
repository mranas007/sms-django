from rest_framework import generics
from apps.admin_panel.permissions import IsAdmin
from apps.core.models import Class
from apps.activity_log.utils import log_activity
from apps.admin_panel.serializers import ClassListSerializer


# Class: Read all, Create
class ClassCR(generics.ListAPIView, generics.CreateAPIView):
    permission_classes = [IsAdmin]
    queryset = Class.objects.all()
    serializer_class = ClassListSerializer

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        class_instance = serializer.save()
        log_activity(self.request.user, 'Class Creation', f'Class {class_instance.name} was created by Admin.', content_object=class_instance)

# Class: Read one, Update, Delete
class ClassRUD(generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    permission_classes = [IsAdmin]
    queryset = Class.objects.all()
    serializer_class = ClassListSerializer

    def perform_update(self, serializer):
        serializer.is_valid(raise_exception=True)
        class_instance = serializer.save()
        log_activity(self.request.user, 'Class Update', f'Class {class_instance.name} was updated by Admin.', content_object=class_instance)

    def perform_destroy(self, instance):
        log_activity(self.request.user, 'Class Deletion', f'Class {instance.name} was deleted by Admin.', content_object=instance)
        instance.delete()


