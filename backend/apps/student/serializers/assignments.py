from rest_framework import serializers

from apps.core.models import Assignment, Class, Subject, User



class NestedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'phone_number', 'address', 'bio', 'role']

class NestedClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'name', 'academic_year', 'schedule']

class NestedSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code']
        
class AssignmentListSerializer(serializers.ModelSerializer):
    teacher = NestedUserSerializer(read_only=True)
    class_assigned = NestedClassSerializer(read_only=True)
    subject = NestedSubjectSerializer(read_only=True)
    assignment_submissions = NestedUserSerializer(many=True, read_only=True)

    class Meta:
        model = Assignment
        fields = ['id', 'title', 'description','assignment_submissions', 'due_date', 'created_at', 'teacher', 'class_assigned', 'subject']

