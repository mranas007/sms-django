import rest_framework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class HomeView(APIView):
    renderer_classes = [rest_framework.renderers.JSONRenderer]  # specify the renderer here

    def get(self, request):
        return Response({'message': 'Home page'}, status=status.HTTP_200_OK)