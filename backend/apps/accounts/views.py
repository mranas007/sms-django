from django.contrib.auth import get_user_model, authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginFormSerializer, RegisterFormSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny

User = get_user_model()

"""
--- Login view ---
"""


class LoginView(APIView):
    authentication_classes = []  # disable authentication
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = LoginFormSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get("username")
            password = serializer.validated_data.get("password")

            user = authenticate(username=username, password=password)

            if user is not None:
                if not user.is_active:
                    return Response(
                        {"error": "This account is disabled."},
                        status=status.HTTP_403_FORBIDDEN,
                    )

                refresh = RefreshToken.for_user(user)
                return Response(
                    {
                        "message": "Login successful",
                        "user": {
                            "id": str(user.id),
                            "username": user.username,
                            "role": user.role,
                        },
                        "token": str(refresh.access_token),
                        "refresh_token": str(refresh),
                    },
                    status=status.HTTP_200_OK,
                )

            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


"""
--- Register view ---
"""


class RegisterView(APIView):
    authentication_classes = []  # disable authentication
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = RegisterFormSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "User registered successfully.",
                    "user": {
                        "id": str(user.id),
                        "username": user.username,
                        "full_name": user.full_name,
                        "role": user.role,
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


"""
--- Log out view ---
"""


class LogoutView(APIView):
    def post(self, request):
        if not request.user.is_authenticated:
            return Response(
                {"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
            )
        from django.contrib.auth import logout

        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
