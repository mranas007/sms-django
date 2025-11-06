from rest_framework.serializers import ModelSerializer, CharField, EmailField, DateField, ImageField, PrimaryKeyRelatedField, Serializer, BooleanField

from apps.core.models import Class, Subject
from apps.accounts.models import User


# Serializer for Subject
class SubjectCreateListSerializer(Serializer):
    id = CharField(read_only=True)
    name = CharField()
    code = CharField()

    class Meta:
        model = Subject
        fields = ('id', 'name', 'code')
        read_only_fields = ('id',)

    def create(self, validated_data):
        return Subject.objects.create(**validated_data)

# Serializer for Class
class ClassListSerializer(Serializer):
    id = CharField(read_only=True)
    name = CharField()
    subjects = PrimaryKeyRelatedField(many=True, queryset=Subject.objects.all())
    teachers = PrimaryKeyRelatedField(many=True, queryset=User.objects.filter(role='Teacher'))
    students = PrimaryKeyRelatedField(many=True, queryset=User.objects.filter(role='Student'))
    academic_year = CharField()
    schedule = CharField()

    class Meta:
        model = Class
        fields = ('id', 'name','subjects', 'teachers','students', 'academic_year','schedule')
        read_only_fields = ('id',)

    def create(self, validated_data):
        subjects_data = validated_data.pop('subjects')
        teachers_data = validated_data.pop('teachers')
        students_data = validated_data.pop('students')

        class_instance = Class.objects.create(**validated_data)
        class_instance.subjects.set(subjects_data)
        class_instance.teachers.set(teachers_data)
        class_instance.students.set(students_data)
        return class_instance

# Serializer for User
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


class UserSerializer(ModelSerializer):
    id = CharField(read_only=True)
    username = CharField(max_length=150, required=False)
    email = EmailField(required=False)
    password = CharField(write_only=True, required=False)
    full_name = CharField(max_length=100, required=False)
    phone_number = CharField(max_length=15, required=False)
    address = CharField(max_length=255, required=False)
    bio = CharField(required=False)
    birth_date = DateField(required=False)
    role = CharField(max_length=10, required=False, default='Student')
    profile_picture = ImageField(required=False)
    is_active = BooleanField(required=False)
    date_joined = CharField(read_only=True)
    last_login = CharField(read_only=True)

    class Meta:
        model = User
        fields = ('id','username', 'email', 'password', 'full_name', 'phone_number', 'address', 'bio', 'birth_date', 'role', 'profile_picture', 'is_active', 'date_joined', 'last_login')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data.get('full_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            address=validated_data.get('address', ''),
            bio=validated_data.get('bio', ''),
            birth_date=validated_data.get('birth_date', None),
            role=validated_data.get('role', 'Student'),
            profile_picture=validated_data.get('profile_picture', None)
        )
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        if 'email' in validated_data:
            instance.email = validated_data['email']
        
        instance.username = validated_data.get('username', instance.username)
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.address = validated_data.get('address', instance.address)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.role = validated_data.get('role', instance.role)
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()
        return instance
