from rest_framework.permissions import BasePermission


class IsNewsAuthorOrAdmin(BasePermission):

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.is_superuser:
            return True

        if user.is_critic:
            return True

        # If news has venue — check if user owns that venue
        if obj.venue:
            return obj.venue.owner.user == user

        # Global news — only critic or superuser
        return False