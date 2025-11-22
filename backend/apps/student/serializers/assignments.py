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
        fields = ['id', 'title', 'description','assignment_submissions',  'due_date', 'created_at', 'teacher', 'class_assigned', 'subject']


# {
#     "id": "bc2914e9-06a5-43df-84bb-4f4f9888ca76",
#     "title": "Python Decorators",
#     "description": "let's make 2 or 3 decorators for check your user is it authenticated and is it not block",
#     "due_date": "2026-01-20T14:02:00Z",
#     "created_at": "2025-11-21T19:04:08.162900Z",
#     "teacher": "e4f20126-0b7d-4193-8dea-562ff90befad",
#     "class_assigned": "76ce2a99-eab8-4974-b474-809bd41305b4",
#     "subject": "870bcf51-6c0f-43b9-826a-54343865d3f3",
# }
