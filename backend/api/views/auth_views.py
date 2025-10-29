from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.core.cache import cache
from django.conf import settings
from drf_spectacular.utils import extend_schema

from api.serializers.user_serializers import (
    UserRegistrationSerializer,
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
            user = serializer.save()

            tokens = get_tokens_for_user(user)

            response_data = {
                'user': UserRegistrationSerializer(user).data,
                'tokens': tokens
            }

            cache.set(cache_key, True, timeout=60)
            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@extend_schema(tags=["Authentication"])
class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        cache_key = f"login_attempt_{request.data.get('email')}"
        if cache.get(cache_key):
            return Response({"detail": "Please wait before trying again."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        response = super().post(request, *args, **kwargs)

        # Cache login attempts briefly to reduce brute force risk
        cache.set(cache_key, True, timeout=30)

        return response

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
