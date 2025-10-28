from rest_framework import serializers
from apps.accounts.models import User

class StudentDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'full_name',
            'email',
            'phone_number',
            'address',
            'bio',
            'birth_date',
            'profile_picture',
            'role',
        ]
