from rest_framework import serializers
from apps.core.models import Assignment, User, Class, Subject

# ---------------------------------


# SERIALIZER FOR CREATING ASSIGNMENTS - ASSIGNMENT VIEW
class AssignmentCreateSerializer(serializers.ModelSerializer):

    title = serializers.CharField(max_length=255)
    description = serializers.CharField()
    class_assigned = serializers.UUIDField()
    subject = serializers.UUIDField()
    due_date = serializers.DateTimeField()

    class Meta:
        model = Assignment
        fields = ["title", "description", "class_assigned", "subject", "due_date"]

    def create(self, validated_data):
        request = self.context.get("request")
        teacher = request.user
        
        try:
            class_assigned = Class.objects.get(id=validated_data["class_assigned"])
            subject = Subject.objects.get(id=validated_data["subject"])
        except Class.DoesNotExist:
            raise serializers.ValidationError({"class_assigned": "Class not found."})
        except Subject.DoesNotExist:
            raise serializers.ValidationError({"subject": "Subject not found."})

        assignment = Assignment.objects.create(
            title=validated_data["title"],
            description=validated_data["description"],
            teacher=teacher,
            class_assigned=class_assigned,
            subject=subject,
            due_date=validated_data["due_date"],
        )
        return assignment


# ---------------------------------


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


# NESTED SERIALIZERS FOR LISTING ASSIGNMENTS  - SUBJECT
class SubjectNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ["id", "name", "code"]


# NESTED SERIALIZERS FOR LISTING ASSIGNMENTS  - CLASS
class ClassNestedSerializer(serializers.ModelSerializer):
    students = UserNestedSerializer(many=True)

    class Meta:
        model = Class
        fields = ["id", "name", "students", "academic_year", "schedule"]


# LIST SERIALIZER FOR ASSIGNMENTS - ASSIGNMENT VIEW
class AssignmentListSerializer(serializers.ModelSerializer):
    teacher = UserNestedSerializer()
    class_assigned = ClassNestedSerializer()
    subject = SubjectNestedSerializer()

    class Meta:
        model = Assignment
        fields = "__all__"


# ---------------------------------


# SERIALIZER FOR CLASS LIST - CLASS
class ClassListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Class
        fields = ["id", "name", "academic_year", "schedule"]
        read_only_fields = fields
