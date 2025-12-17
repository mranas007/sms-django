from channels.generic.websocket import WebsocketConsumer
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from apps.chat.models import Group, Chat
from apps.chat.serializers import ChatSerializer

class TeacherConsumer(WebsocketConsumer):
    def connect(self):
        self.group_id = self.scope['url_route']['kwargs']['group_id']
        self.user = self.scope['user']

        if not self.user.is_authenticated:
            self.close()
            return

        try:
            self.group = Group.objects.get(id=self.group_id)
        except Group.DoesNotExist:
            self.close()
            return

        # Check if user is creator or member
        is_member = self.group.members.filter(id=self.user.id).exists()
        if self.group.group_creator != self.user and not is_member:
            self.send(json.dumps({
                'message': 'You are not authorized to join this group'
            }))
            self.close()
            return

        self.group_name = f"chat_{self.group_id}"
        
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )

        self.accept()

        # Send existing messages
        group_chats = Chat.objects.filter(group=self.group).order_by('created_at')
        chat_serialized = ChatSerializer(group_chats, many=True)
        self.send(json.dumps({
            'type': 'connection_established',
            'message': 'connected',
            'chats': chat_serialized.data
        }))

    def disconnect(self, close_code):
        # Leave room group
        if hasattr(self, 'group_name'):
            async_to_sync(self.channel_layer.group_discard)(
                self.group_name,
                self.channel_name
            )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message')
        
        if not message:
            return

        # Save message to database
        chat = Chat.objects.create(
            group=self.group,
            sender=self.user,
            message=message
        )
        
        serialized_chat = ChatSerializer(chat).data

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'chat_message',
                'chat': serialized_chat
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        chat = event['chat']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'type': 'chat_message',
            'chat': chat
        }))