from rest_framework.serializers import Serializer, ModelSerializer, CharField
from apps.core.models import Subject



# Serializer for Subject
class SubjectSerializer(Serializer):
    id = CharField(read_only=True)
    name = CharField()
    code = CharField()

    class Meta:
        model = Subject
        fields = ('id', 'name', 'code')
        read_only_fields = ('id',)

    def create(self, validated_data):
        return Subject.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.code = validated_data.get('code', instance.code)
        instance.save()
        return instance
    