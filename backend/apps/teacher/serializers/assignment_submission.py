from rest_framework import serializers

from apps.core.models import Assignment, AssignmentSubmission, User



# ---------------------------------

# NESTED SERIALIZER FOR ASSIGNMENT DETAILS IN SUBMISSION VIEW
class AssignmentNestedSerializer(serializers.ModelSerializer):

    class Meta:
        model = Assignment
        fields = [
            "id",
            "title",
            "description",
            "due_date",
            "class_assigned",
            "subject",
        ]


# NESTED SERIALIZERS FOR LISTING ASSIGNMENTS  - TEACHER
class UserNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "full_name",
            "email",
            "phone_number",
            "address",
            "bio",
            "role",
        ]


class StudentAssignmentListSerializer(serializers.ModelSerializer):
    student = UserNestedSerializer(read_only=True)
    assignment = AssignmentNestedSerializer(read_only=True)

    class Meta:
        model = AssignmentSubmission
        fields = ["id", "student", "assignment", "content", "file_upload", "submitted_at", "grade", "feedback"]



# ---------------------------------

