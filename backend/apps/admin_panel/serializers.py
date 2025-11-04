from rest_framework.serializers import Serializer, CharField

from apps.core.models import Class, Subject
from apps.accounts.models import User



class GetUsersSerializer(Serializer):
    id = CharField(read_only=True)
    username = CharField(read_only=True)
    email = CharField(read_only=True)
    is_staff = CharField(read_only=True)
    is_superuser = CharField(read_only=True)
    is_active = CharField(read_only=True)
    role = CharField(read_only=True)    
    date_joined = CharField(read_only=True)
    last_login = CharField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email','is_staff', 'is_superuser', 'is_active', 'date_joined', 'last_login')
        read_only_fields = ('id', 'username', 'email',  'is_staff', 'is_superuser', 'is_active', 'date_joined', 'last_login')

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