# from rest_framework.generics import ListAPIView
# from apps.chat.models import Group
# from apps.chat.serializers import GroupSerializer
# from apps.core.permissions import RoleRequiredPermission


# class Groups(ListAPIView):
#     permission_classes = [RoleRequiredPermission]
#     allowed_roles = ['Teacher']
#     queryset = Group.objects.all()
#     serializer_class = GroupSerializer

   
from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView 
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from apps.chat.models import Group
from apps.chat.serializers import GroupSerializer
from apps.core.permissions import RoleRequiredPermission


class GroupListCreateView(ListCreateAPIView):
    permission_classes = [RoleRequiredPermission]
    allowed_roles = ['Teacher']
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def get_queryset(self):
        return super().get_queryset().filter(group_creator=self.request.user)

    def perform_create(self, serializer):
        serializer.save(group_creator=self.request.user)


class GroupRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [RoleRequiredPermission]
    allowed_roles = ['Teacher']