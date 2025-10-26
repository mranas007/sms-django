from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .permission import RoleRequired


class DashboardView(APIView):
    permission_classes = [IsAuthenticated, RoleRequired('Student')]

    def get(self, request):
        return Response({"greet":"hello world"}, status=status.HTTP_200_OK)
