from rest_framework.serializers import Serializer, ModelSerializer, CharField, EmailField, DateField, ImageField, BooleanField
from rest_framework import serializers as drf_serializers
from apps.accounts.models import User



class UserListSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'phone_number', 'address', 'bio', 'birth_date', 'role', 'profile_picture', 'is_active', 'date_joined', 'last_login')
        read_only_fields = fields


class UserCreateSerializer(ModelSerializer):
    id = CharField(read_only=True)
    username = CharField(max_length=150)
    email = EmailField()
    password = CharField(write_only=True)
    cpassword = CharField(write_only=True)
    full_name = CharField(max_length=100, required=False)
    phone_number = CharField(max_length=15, required=False)
    address = CharField(max_length=255, required=False)
    bio = CharField(required=False)
    birth_date = DateField(required=False)
    role = CharField(max_length=10, required=False, default='Student')
    profile_picture = ImageField(required=False)
    is_active = BooleanField(read_only=True)
    date_joined = CharField(read_only=True)
    last_login = CharField(read_only=True)

    class Meta:
        model = User
        fields = ('id','username', 'email', 'password', 'cpassword', 'full_name', 'phone_number', 'address', 'bio', 'birth_date', 'role', 'profile_picture', 'is_active', 'date_joined', 'last_login')

    def validate(self, data):
        if 'password' in data and 'cpassword' in data and data['password'] != data['cpassword']:
            raise drf_serializers.ValidationError({
                'detail': 'Password and Confirm Password do not match.'
            })
        return data

    def create(self, validated_data):
        username = validated_data.get('username')
        email = validated_data.get('email')
        password = validated_data.get('password')

        if not username or not email or not password:
            raise drf_serializers.ValidationError({
                'detail': 'username, email and password are required.'
            })

        if User.objects.filter(username=username).exists():
            raise drf_serializers.ValidationError({'username': 'A user with that username already exists.'})

        if User.objects.filter(email=email).exists():
            raise drf_serializers.ValidationError({'email': 'A user with that email already exists.'})
        
        validated_data.pop('cpassword', None)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            full_name=validated_data.get('full_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            address=validated_data.get('address', ''),
            bio=validated_data.get('bio', ''),
            birth_date=validated_data.get('birth_date', None),
            role=validated_data.get('role', 'Student'),
            profile_picture=validated_data.get('profile_picture', None)
        )
        return user


class UserUpdateSerializer(ModelSerializer):
    username = CharField(max_length=150, required=False)
    email = EmailField(required=False)
    password = CharField(write_only=True, required=False)
    full_name = CharField(max_length=100, required=False)
    phone_number = CharField(max_length=15, required=False)
    address = CharField(max_length=255, required=False)
    bio = CharField(required=False)
    birth_date = DateField(required=False)
    role = CharField(max_length=10, required=False)
    profile_picture = ImageField(required=False)
    is_active = BooleanField(required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'full_name', 'phone_number', 'address', 'bio', 'birth_date', 'role', 'profile_picture', 'is_active')

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
