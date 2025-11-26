from rest_framework import serializers
from apps.core.models import Assignment, AssignmentSubmission



class AssignmentSubmissionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = [
            "id",
            "assignment_title",
            "subject_name",
            "content",
            "feedback",
            "grade",
            "submitted_at",
        ]
   

    assignment_title = serializers.ReadOnlyField(source="assignment.title")
    subject_name = serializers.ReadOnlyField(source="assignment.subject.name")

class AssignmentSubmissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = ["assignment", "content", "file_upload"] 
    
    def create(self, validated_data):
        try:
            request = self.context.get("request")
            validated_data["student"] = request.user
            assignment_already_exist = AssignmentSubmission.objects.filter(
                assignment=validated_data["assignment"], student=request.user
            ).exists()
            if assignment_already_exist:
                raise serializers.ValidationError("You have already submitted this assignment.")
            return AssignmentSubmission.objects.create(**validated_data)
        except Assignment.DoesNotExist:
            raise serializers.ValidationError("Assignment does not exist.")
