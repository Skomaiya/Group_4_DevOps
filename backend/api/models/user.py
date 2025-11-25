from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('instructor', 'Instructor'),
    )

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)

    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.username} ({self.role})"


class Profile(models.Model):
    """
    Profile model for both Students and Instructors.
    Some fields are specific to instructors while others are common.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, help_text="User biography")

    # Instructor-specific fields
    expertise = models.TextField(blank=True, help_text="Areas of expertise (for instructors)")
    credentials = models.JSONField(default=list, blank=True, help_text="Academic credentials and certifications")
    teaching_experience = models.IntegerField(default=0, help_text="Years of teaching experience (for instructors)")

    # Student-specific fields
    enrolled_courses_count = models.IntegerField(default=0, help_text="Number of courses enrolled (for students)")
    completed_courses_count = models.IntegerField(default=0, help_text="Number of completed courses (for students)")

    # Common fields
    languages = models.JSONField(default=list, blank=True, help_text="Languages spoken")
    profile_picture = models.URLField(blank=True, help_text="URL to profile picture")

    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True, help_text="GitHub profile (for instructors)")
    website = models.URLField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.username}"
