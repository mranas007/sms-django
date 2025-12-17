from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView 
from apps.chat.models import Group
from apps.chat.serializers import GroupSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from apps.core.permissions import RoleRequiredPermission


class GroupListCreateView(ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [RoleRequiredPermission]
    allowed_roles = ['Teacher']

    def perform_create(self, serializer):
        serializer.save(group_creator=self.request.user)

class GroupRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [RoleRequiredPermission]
    allowed_roles = ['Teacher']