from django.urls import re_path
from .consumers import teacher


websocket_urlpatterns = [
    re_path(r"ws/chat/group/(?P<group_id>[0-9a-f-]+)/", teacher.TeacherConsumer.as_asgi()),
]