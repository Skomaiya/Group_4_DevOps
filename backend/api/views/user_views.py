from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from api.models.user import User, Profile
from api.serializers.user_serializers import UserSerializer, ProfileSerializer
from api.permissions import IsAdmin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema

CACHE_TTL = getattr(settings, 'CACHE_TTL', 300)
PROFILE_CACHE_KEY = "user_profile"
USER_CACHE_KEY = "user_list"


@extend_schema(tags=["Users"])
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cache_key = f"{USER_CACHE_KEY}_{request.user.id}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)
        serializer = UserSerializer(request.user)
        cache.set(cache_key, serializer.data, timeout=CACHE_TTL)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            cache.set(f"{USER_CACHE_KEY}_{request.user.id}", serializer.data, timeout=CACHE_TTL)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            cache.set(f"{USER_CACHE_KEY}_{request.user.id}", serializer.data, timeout=CACHE_TTL)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user_id = request.user.id
        request.user.delete()
        cache.delete(f"{USER_CACHE_KEY}_{user_id}")
        cache.delete(f"{PROFILE_CACHE_KEY}_{user_id}")
        return Response({"detail": "User account deleted."}, status=status.HTTP_204_NO_CONTENT)


@extend_schema(tags=["Profiles"])
class CurrentUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cache_key = f"{PROFILE_CACHE_KEY}_{request.user.id}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)
        try:
            profile = request.user.profile
            serializer = ProfileSerializer(profile)
            cache.set(cache_key, serializer.data, timeout=CACHE_TTL)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            cache.set(f"{PROFILE_CACHE_KEY}_{request.user.id}", serializer.data, timeout=CACHE_TTL)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            cache.set(f"{PROFILE_CACHE_KEY}_{request.user.id}", serializer.data, timeout=CACHE_TTL)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        profile = request.user.profile
        uid = request.user.id
        profile.delete()
        cache.delete(f"{PROFILE_CACHE_KEY}_{uid}")
        return Response({"detail": "Profile deleted."}, status=status.HTTP_204_NO_CONTENT)


@extend_schema(tags=["Users"])
class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['username', 'email']

    def list(self, request, *args, **kwargs):
        cache_key = f"{USER_CACHE_KEY}_all"
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        response_data = self.get_paginated_response(serializer.data).data
        cache.set(cache_key, response_data, timeout=CACHE_TTL)
        return Response(response_data)

    def perform_create(self, serializer):
        response = serializer.save()
        self.clear_cache()
        return response

    def perform_update(self, serializer):
        response = serializer.save()
        self.clear_cache()
        return response

    def perform_destroy(self, instance):
        instance.delete()
        self.clear_cache()

    def clear_cache(self):
        cache.delete_pattern(f"{USER_CACHE_KEY}*")


@extend_schema(tags=["Profiles"])
class ProfileViewSet(ModelViewSet):
    queryset = Profile.objects.select_related('user').all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend]
    # 'availability' field doesn't exist on Profile; remove it
    filterset_fields = ['user__username', 'user__email']

    def perform_create(self, serializer):
        obj = serializer.save()
        self.clear_cache(obj.user_id)
        return obj

    def perform_update(self, serializer):
        obj = serializer.save()
        self.clear_cache(obj.user_id)
        return obj

    def perform_destroy(self, instance):
        uid = instance.user_id
        instance.delete()
        self.clear_cache(uid)

    def clear_cache(self, user_id):
        cache.delete(f"{PROFILE_CACHE_KEY}_{user_id}")
