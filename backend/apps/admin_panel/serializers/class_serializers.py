from apps.core.models import Class, Subject
from apps.accounts.models import User
from rest_framework.serializers import Serializer, ModelSerializer, CharField, PrimaryKeyRelatedField



# New Serializer for Subject
class SubjectNestedSerializer(ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code']


# New Serializer for User (Teachers and Students)
class UserNestedSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'phone_number', 'address', 'bio', 'role']
        

class ClassListSerializer(ModelSerializer):
    subjects = SubjectNestedSerializer(many=True, read_only=True)
    teachers = UserNestedSerializer(many=True, read_only=True)
    students = UserNestedSerializer(many=True, read_only=True)

    class Meta:
        model = Class
        fields = ('id', 'name','subjects', 'teachers','students', 'academic_year','schedule')
        read_only_fields = ('id', 'academic_year', 'schedule')



class ClassCreateSerializer(ModelSerializer):
    subjects = PrimaryKeyRelatedField(queryset=Subject.objects.all(), many=True)
    teachers = PrimaryKeyRelatedField(queryset=User.objects.filter(role='Teacher'), many=True)
    students = PrimaryKeyRelatedField(queryset=User.objects.filter(role='Student'), many=True)

    class Meta:
        model = Class
        fields = ('id', 'name', 'subjects', 'teachers', 'students', 'academic_year', 'schedule')
        read_only_fields = ('id')

    def create(self, validated_data):
        subjects_data = validated_data.pop('subjects', [])
        teachers_data = validated_data.pop('teachers', [])
        students_data = validated_data.pop('students', [])

        class_instance = Class.objects.create(**validated_data)

        class_instance.subjects.set(subjects_data)
        class_instance.teachers.set(teachers_data)
        class_instance.students.set(students_data)

        return class_instance
