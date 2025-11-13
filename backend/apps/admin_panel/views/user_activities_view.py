from rest_framework import generics
from rest_framework.response import Response

from apps.activity_log.models import ActivityLog
from apps.activity_log.serializers import ActivityLogSerializer
from apps.admin_panel.pagination import UserPagination
from apps.admin_panel.permissions import IsAdmin



class UserActivitiesR(generics.ListAPIView):
    permission_classes = [IsAdmin]
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    pagination_class = UserPagination
    