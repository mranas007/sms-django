from rest_framework import permissions

class RoleRequiredPermission(permissions.BasePermission):
    """
    Check if the user's role matches one of the allowed roles.
    """
    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        # Get allowed roles from the view
        required_roles = getattr(view, 'allowed_roles', None)

        if required_roles is None:
            return False  # No roles defined = deny

        return user.role in required_roles
