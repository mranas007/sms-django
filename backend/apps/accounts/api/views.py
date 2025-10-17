from django.contrib.auth import get_user_model, authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginFormSerializer

User = get_user_model()

class LoginView(APIView):
    def post(self, request):
        serializer = LoginFormSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get('username')
            password = serializer.data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                if user.is_superuser:
                    return Response({'message': 'Admin login successful'}, status=status.HTTP_200_OK)
                if user.role == 'Teacher':
                    return Response({'message': 'Teacher login successful'}, status=status.HTTP_200_OK)
                if user.role == 'Student':
                    return Response({'message': 'Student login successful'}, status=status.HTTP_200_OK)
                return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)

# Logout view
class LogoutView(APIView):
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        from django.contrib.auth import logout
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

