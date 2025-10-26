from rest_framework import serializers
from apps.accounts.models import User


class LoginFormSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, max_length=150)
    password = serializers.CharField(required=True, max_length=128, write_only=True)


class RegisterFormSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

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

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
