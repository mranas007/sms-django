from rest_framework.permissions import BasePermission
from rest_framework import status
from rest_framework.exceptions import APIException

class RoleRequired(BasePermission):
    message = 'You do not have permission to perform this action.'

    def __init__(self, required_role):
        self.required_role = required_role

    def has_permission(self, request, view):
        # Check if the user is authenticated by DRF's authentication classes
        # (e.g., JWTAuthentication)
        if not request.user or not request.user.is_authenticated:
            # DRF's IsAuthenticated permission should handle this first,
            # but this provides a fallback or explicit check.
            return False

        # Check if the user has the required role
        if getattr(request.user, 'role', None) == self.required_role:
            return True
        
        # If not, raise a permission denied exception
        # This will result in a 403 Forbidden response, not a redirect.
        raise APIException(detail=self.message, code=status.HTTP_403_FORBIDDEN)

# You might also want a helper function to instantiate it easily
def is_role_required(role):
    return type('IsRoleRequired', (RoleRequired,), {'required_role': role})