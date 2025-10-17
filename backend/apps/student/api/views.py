from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from apps.accounts.decorators import role_required
from .serializers import StudentDashboardSerializer


@method_decorator([login_required, role_required('Student')], name='dispatch')
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = StudentDashboardSerializer(data={'user': request.user.username})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)