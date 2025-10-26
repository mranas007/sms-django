from rest_framework.serializers import Serializer, CharField
from core.models import Class, Subject

class ClassSerializer(Serializer):
    id = CharField(read_only=True)
    name = CharField(read_only=True)
    subjects = CharField(read_only=True)
    teachers = CharField(read_only=True)
    students = CharField(read_only=True)
    academic_year = CharField(read_only=True)
    schedule = CharField(read_only=True)

    class Meta:
        model = Class
        fields = ('id', 'name', 'subjects', 'teachers', 'students', 'academic_year', 'schedule')

class SubjectSerializer(Serializer):
    id = CharField(read_only=True)
    name = CharField(read_only=True)
    code = CharField(read_only=True)

    class Meta:
        model = Subject
        fields = ('id', 'name', 'code')
        read_only_fields = ('id', 'name', 'code')