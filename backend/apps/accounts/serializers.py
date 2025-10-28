from rest_framework import serializers
from apps.accounts.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'role': self.user.role,
        }
        return data

class RegisterFormSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "username",
            "full_name",
            "phone_number",
            "address",
            "bio",
            "birth_date",
            "role",
            "profile_picture",
            "password",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.save()
        return user
