from rest_framework import serializers

from apps.core.models import Class, Subject
from apps.accounts.models import User



class UserNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'phone_number', 'address', 'bio', 'role']


class SubjectNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject  
        fields = ['id', 'name', 'code']   


class ClassListSerializer(serializers.ModelSerializer):

    subjects = SubjectNestedSerializer(many=True)
    students = UserNestedSerializer(many=True)
    teachers = UserNestedSerializer(many=True)

    class Meta:
        model = Class
        fields = ['id', 'subjects', 'students', 'teachers', 'name', 'academic_year', 'schedule', 'timestamp']
        read_only_fields = fields


 