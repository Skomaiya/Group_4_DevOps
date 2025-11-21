from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AnonymousUser


class CustomJWTAuthentication(JWTAuthentication):
    """
    Custom authentication class to reject tokens for inactive users.
    """

    def get_user(self, validated_token):
        user = super().get_user(validated_token)

        # Block inactive or missing users
        if not user or isinstance(user, AnonymousUser):
            raise InvalidToken(_("Invalid token: User not found."))

        if not user.is_active:
            raise InvalidToken(_("User account is inactive or suspended."))

        return user


def get_tokens_for_user(user):
    """
    Generates JWT refresh and access tokens, including useful claims.
    """
    refresh = RefreshToken.for_user(user)
    access = refresh.access_token

    # Optional: Embed extra data into access token
    access['username'] = user.username
    access['role'] = _get_user_role(user)

    return {
        'refresh': str(refresh),
        'access': str(access),
    }


def _get_user_role(user):
    """
    Maps Django group or user role to a simple role string.
    """
    if user.groups.filter(name='Admin').exists():
        return 'admin'
    elif user.role == 'instructor':
        return 'instructor'
    elif user.role == 'student':
        return 'student'
    return 'user'
