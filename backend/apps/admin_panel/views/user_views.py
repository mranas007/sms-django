from django.db.models import Q

from rest_framework import generics

from apps.activity_log.utils import log_activity
from apps.admin_panel.pagination import UserPagination
from apps.admin_panel.permissions import IsAdmin
from apps.accounts.models import User
from apps.admin_panel.serializers import UserSerializer



# USER: Read all, Create
class UserCR(generics.ListAPIView,generics.CreateAPIView):
    permission_classes = [IsAdmin]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = UserPagination

    def get_queryset(self):
        queryset = User.objects.all().order_by('-date_joined')
        role = self.request.query_params.get('role')
        search = self.request.query_params.get('search')
        if role:
            print(role)
            queryset = queryset.filter(role=role)
        if search:
            queryset = queryset.filter(Q(username__icontains=search) | Q(emil__icontains=search))
        
        return queryset 

    def perform_create(self, serializer):
        user = serializer.save()
        log_activity(user, 'User Creation', f'User {user.username} was created by Admin.', content_object=user)



# USER: Read one, Update, Delete
class UserRUD(generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    permission_classes = [IsAdmin]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        user = serializer.save()
        log_activity(user, 'User Update', f'User {user.username} was updated by Admin.', content_object=user)

    def perform_destroy(self, instance):
        log_activity(self.request.user, 'User Deletion', f'User {instance.username} was deleted by Admin.', content_object=instance)
        instance.delete()
