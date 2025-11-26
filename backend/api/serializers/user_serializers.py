from rest_framework import serializers
from api.models.user import User, Profile
from django.contrib.auth.models import Group
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import transaction


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'bio', 'expertise', 'credentials', 'teaching_experience',
            'enrolled_courses_count', 'completed_courses_count',
            'languages', 'profile_picture', 'linkedin_url',
            'github_url', 'website', 'created_at', 'updated_at'
        ]
        read_only_fields = ['enrolled_courses_count', 'completed_courses_count', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'role', 'phone_number',
            'country', 'city', 'is_active',
            'is_verified', 'created_at', 'updated_at', 'date_joined', 'profile'
        ]
        read_only_fields = ['is_active', 'is_verified', 'created_at', 'updated_at', 'date_joined']
    
    def to_representation(self, instance):
        """Override to handle cases where profile might not exist"""
        representation = super().to_representation(instance)
        try:
            # Check if profile exists using getattr to avoid DoesNotExist exception
            profile = getattr(instance, 'profile', None)
            if profile is None:
                representation['profile'] = None
        except Exception:
            representation['profile'] = None
        return representation


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'role', 'phone_number', 'password',
            'country', 'city'
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_role(self, value):
        if value not in ['student', 'instructor']:
            raise serializers.ValidationError("Invalid role. Must be student or instructor.")
        return value

    def validate(self, attrs):
        required_fields = ['username', 'email', 'phone_number', 'role', 'country', 'city']
        missing_fields = [field for field in required_fields if not attrs.get(field)]

        if missing_fields:
            errors = {}
            for field in missing_fields:
                errors[field] = ["This field is required to verify your account."]
            raise serializers.ValidationError(errors)

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        password = validated_data.pop('password')
        role = validated_data.get('role')

        user = User(**validated_data)
        user.set_password(password)

        # Set verified since all required fields were already validated
        user.is_verified = True
        user.save()

        # Assign to group
        group_name = 'Student' if role == 'student' else 'Instructor'
        group, _ = Group.objects.get_or_create(name=group_name)
        user.groups.add(group)

        # Profile will be created automatically by signal in apps.py
        # But ensure it exists in case signal didn't fire
        try:
            Profile.objects.get_or_create(user=user)
        except Exception:
            # If profile creation fails, log but don't fail registration
            pass

        return user


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        if 'refresh' not in attrs:
            raise serializers.ValidationError("Refresh token is required.")
        return attrs


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer that accepts email for login (since USERNAME_FIELD is 'email').
    Maps 'email' field from request to 'username' field for parent authentication.
    """
    email = serializers.EmailField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        # Get email from request (frontend sends 'email' field)
        email = attrs.get('email', '')
        
        if email:
            # Map email to username field (since USERNAME_FIELD is 'email')
            attrs['username'] = email
        elif 'username' in attrs:
            # If username is provided (backward compatibility), use it as email
            # This handles cases where username might be sent instead
            attrs['username'] = attrs.get('username', '')
        
        # Call parent validate which will authenticate using email (USERNAME_FIELD)
        # This will raise ValidationError if credentials are invalid
        data = super().validate(attrs)
        
        user_data = {
            "id": self.user.id,
            "email": self.user.email,
            "username": self.user.username,
            "role": self.user.role,
        }
        data['user'] = user_data
        return data