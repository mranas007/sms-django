"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter
from channels.routing import URLRouter
from apps.chat.routing import websocket_urlpatterns
from apps.chat.middleware import JwtAuthMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# This is the root routing configuration that handles both HTTP and WebSockets
application = ProtocolTypeRouter({
    # 1. HTTP requests (e.g., loading the HTML page) go to the standard Django handler
    "http": get_asgi_application(),

    # 2. WebSocket requests (the ws:// connection) are handled by JwtAuthMiddleware
    #    which parses the ?token=... query param
    "websocket": JwtAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    ),
    
})