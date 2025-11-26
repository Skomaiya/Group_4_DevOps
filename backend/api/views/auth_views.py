from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from django.conf import settings
from drf_spectacular.utils import extend_schema

from api.serializers.user_serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer,
    LogoutSerializer,
)
from api.authentication import get_tokens_for_user

User = get_user_model()
CACHE_TTL = getattr(settings, 'CACHE_TTL', 300)


@extend_schema(tags=["Authentication"])
class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        cache_key = f"register_attempt_{request.data.get('email')}"
        if cache.get(cache_key):
            return Response({"detail": "Please wait before trying again."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                
                # Profile should be created by signal, but ensure it exists
                from api.models.user import Profile
                try:
                    profile, created = Profile.objects.get_or_create(user=user)
                except Exception as profile_error:
                    # Log but don't fail registration if profile creation has issues
                    import logging
                    logger = logging.getLogger(_name_)
                    logger.warning(f"Profile creation issue (non-fatal): {str(profile_error)}")
                
                # Refresh user from database to ensure all relationships are loaded
                user.refresh_from_db()

                tokens = get_tokens_for_user(user)

                # Use UserSerializer to include all user fields including role
                try:
                    user_serializer = UserSerializer(user)
                    user_data = user_serializer.data
                except Exception as ser_error:
                    # If serialization fails, return basic user data
                    import logging
                    logger = logging.getLogger(_name_)
                    logger.warning(f"UserSerializer failed, using basic data: {str(ser_error)}")
                    user_data = {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'role': user.role,
                        'phone_number': user.phone_number,
                        'country': user.country,
                        'city': user.city,
                        'is_active': user.is_active,
                        'is_verified': user.is_verified,
                        'profile': None
                    }
                
                response_data = {
                    'user': user_data,
                    'tokens': tokens
                }

                cache.set(cache_key, True, timeout=60)
                return Response(response_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                # Log the error for debugging
                import logging
                import traceback
                logger = logging.getLogger(_name_)
                error_trace = traceback.format_exc()
                logger.error(f"Error creating user: {str(e)}\n{error_trace}")
                return Response(
                    {"detail": f"An error occurred during registration: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=["Authentication"])
class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # Use email for cache key (frontend now sends email)
        email = request.data.get('email', '') or request.data.get('username', '')
        cache_key = f"login_attempt_{email}"
        
        # Check cache before attempting login
        if cache.get(cache_key):
            return Response({"detail": "Please wait before trying again."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        try:
            response = super().post(request, *args, **kwargs)
            
            # Only cache failed attempts, not successful ones
            # This allows immediate re-login after logout
            if response.status_code != status.HTTP_200_OK:
                cache.set(cache_key, True, timeout=30)
            else:
                # Clear any existing cache for this user on successful login
                cache.delete(cache_key)
            
            return response
        except Exception as e:
            # On any error, cache the attempt
            cache.set(cache_key, True, timeout=30)
            raise


@extend_schema(tags=["Authentication"])
class LogoutView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LogoutSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            token = RefreshToken(serializer.validated_data['refresh'])
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)