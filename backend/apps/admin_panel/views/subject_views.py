from rest_framework import generics
from apps.admin_panel.permissions import IsAdmin
from apps.core.models import Subject
from apps.admin_panel.serializers.subject_serializers import SubjectCreateListSerializer
from apps.activity_log.utils import log_activity
from django.db.models import Q


# Subject: Read all, Create
class SubjectCR(generics.ListAPIView, generics.CreateAPIView):
    permission_classes = [IsAdmin]
    queryset = Subject.objects.all()
    serializer_class = SubjectCreateListSerializer

    def get_queryset(self):

        searchQuery = self.request.query_params.get("s")
        if searchQuery:
            return Subject.objects.filter(
                Q(name__icontains=searchQuery) | Q(code__icontains=searchQuery)
            )

        return Subject.objects.all()

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        subject = serializer.save()
        log_activity(
            self.request.user,
            "Subject Creation",
            f"Subject {subject.name} was created by Admin.",
            content_object=subject,
        )


# Subject: Read one, Update, Delete
class SubjectRUD(
    generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView
):

    permission_classes = [IsAdmin]
    queryset = Subject.objects.all()
    serializer_class = SubjectCreateListSerializer

    def perform_update(self, serializer):
        serializer.is_valid(raise_exception=True)
        subject = serializer.save()
        log_activity(
            self.request.user,
            "Subject Update",
            f"Subject {subject.name} was updated by Admin.",
            content_object=subject,
        )

    def perform_destroy(self, instance):
        log_activity(
            self.request.user,
            "Subject Deletion",
            f"Subject {instance.name} was deleted by Admin.",
            content_object=instance,
        )
        instance.delete()
