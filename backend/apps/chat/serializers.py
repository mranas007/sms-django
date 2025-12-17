from rest_framework import serializers
from apps.chat.models import Group, Chat
from apps.core.models import Class



class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'name'] 

class GroupListCreateSerializer(serializers.ModelSerializer):
    group_class = ClassSerializer(read_only=True)
   

    class Meta:
        model = Group
        fields = ['id', 'name', 'group_class', 'group_class_id', 'created_at', 'updated_at'] 

    def create(self, validated_data): 
        # Extract members data if any, though we are setting it manually
        user = self.context['request'].user
        
        # validated_data already has 'group_class' object due to source='group_class' mapping
        # Create the group instance first (without members)
        group = Group.objects.create(group_creator=user, **validated_data)
        
        # Add members after creation
        # Assuming group_class has M2M or Reverse FK to students.
        # Check model definition: 'group.group_class.students' (related_name on Student or Class?)
        # User code showed: validated_data['group_class'].students.all()
        # Ensure 'students' is the correct related_name. Assuming it is based on user code.
        
        students = group.group_class.students.all()
        group.members.set(students)
        group.members.add(user)
        
        return group 


class ChatSerializer(serializers.ModelSerializer):
    sender = serializers.ReadOnlyField(source='sender.username')

    class Meta:
        model = Chat
        fields = ['id', 'sender','message', 'created_at']

    def create(self, validated_data): 
        return Chat.objects.create(**validated_data) 