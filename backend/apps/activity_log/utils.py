from django.contrib.contenttypes.models import ContentType
from .models import ActivityLog

def log_activity(user, action_type, message, content_object=None):
    """Logs an activity for a given user and content object."""
    if content_object:
        content_type = ContentType.objects.get_for_model(content_object)
        ActivityLog.objects.create(
            user=user,
            action_type=action_type,
            message=message,
            content_type=content_type,
            object_id=content_object.id
        )
    else:
        ActivityLog.objects.create(
            user=user,
            action_type=action_type,
            message=message,
        )