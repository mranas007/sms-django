from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from django.db import close_old_connections
from urllib.parse import parse_qs

User = get_user_model()

@database_sync_to_async
def get_user(token):
    try:
        # Verify the token
        access_token = AccessToken(token)
        user_id = access_token.payload.get('user_id')
        return User.objects.get(id=user_id)
    except Exception:
        return AnonymousUser()

class JwtAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # Close old database connections to prevent usage of timed out connections
        close_old_connections()

        # Parse query string
        query_string = scope.get("query_string", b"").decode("utf-8")
        query_params = parse_qs(query_string)
        token = query_params.get("token", [None])[0]

        if token:
            scope["user"] = await get_user(token)
        else:
            scope["user"] = AnonymousUser()

        return await self.app(scope, receive, send)
