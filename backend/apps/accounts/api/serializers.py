from rest_framework.serializers import Serializer, CharField


class LoginFormSerializer(Serializer):
    username = CharField(required=True, max_length=150)
    password = CharField(required=True, max_length=128)

    class Meta:
        fields = ['username', 'password']
        