from rest_framework import generics
from apps.admin_panel.permissions import IsAdmin
from apps.core.models import Subject
from apps.admin_panel.serializers.subject_serializers import SubjectSerializer
from apps.activity_log.utils import log_activity
from django.db.models import Q


# Subject: Read all, Create
class SubjectCR(generics.ListAPIView, generics.CreateAPIView):
    """
    View to list all subjects and create new subjects.
    Only accessible by admins.
    Supports search by name or code.
    """
    permission_classes = [IsAdmin]
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

    def get_queryset(self):
        """
        Returns queryset of subjects, optionally filtered by search query.
        Orders results by name for consistency.
        """
        queryset = self.queryset

        # Get search query from URL parameters
        search_query = self.request.query_params.get("s")
        
        if search_query:
            # Strip whitespace and search in name or code (case-insensitive)
            search_query = search_query.strip()
            queryset = queryset.filter(
                Q(name__icontains=search_query) | Q(code__icontains=search_query)
            )
        
        # Order by name for consistent results
        return queryset.order_by('name')

    def perform_create(self, serializer):
        """
        Creates a new subject and logs the activity.
        """
        # Save the subject (validation happens automatically)
        subject = serializer.save()
        
        # Log the creation activity with error handling
        try:
            log_activity(
                self.request.user,
                "Subject Creation",
                f"Subject '{subject.name}' (Code: {subject.code}) was created by {self.request.user.username}.",
                content_object=subject,
            )
        except Exception as e:
            # Log the error but don't fail the creation
            # You might want to use proper logging here
            print(f"Failed to log activity: {str(e)}")
        
        # You could also send a success response with custom message if needed
        # return Response({'message': 'Subject created successfully'}, status=status.HTTP_201_CREATED)

# Subject: Read one, Update, Delete
class SubjectRUD(
    generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView
):

    permission_classes = [IsAdmin]
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

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
