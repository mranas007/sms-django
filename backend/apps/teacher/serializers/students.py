from rest_framework import serializers
from apps.core.models import User


class StudentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "email",
            "username",
            "phone_number",
            "address",
            "bio",
            "birth_date",
            "profile_picture",
        ]
