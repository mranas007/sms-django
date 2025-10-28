from rest_framework.generics import ListAPIView
from .permissions import RoleRequiredPermission
from .serializers import StudentDashboardSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class DashboardView(ListAPIView):
    permission_classes = [RoleRequiredPermission]
    allowed_roles = ["Student"]
    serializer_class = StudentDashboardSerializer

    def get_queryset(self):
        # Get the base queryset
        return User.objects.filter(role="Student")

