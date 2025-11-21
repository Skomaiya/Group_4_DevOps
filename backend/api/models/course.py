from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Course(models.Model):
    """
    Course model for LearnHub LMS.
    Instructors can create and manage courses.
    """
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
    )

    LEVEL_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    )

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField()
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_courses')

    # Course metadata
    category = models.CharField(max_length=100, blank=True)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    duration_hours = models.IntegerField(default=0, help_text="Estimated course duration in hours")

    # Course content
    thumbnail = models.URLField(blank=True, help_text="URL to course thumbnail image")
    preview_video_url = models.URLField(blank=True, help_text="Preview video URL")

    # Course status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_featured = models.BooleanField(default=False)

    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # Analytics (will be automatically updated)
    enrolled_students_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} by {self.instructor.username}"


class Enrollment(models.Model):
    """
    Enrollment model to track student enrollments in courses.
    """
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('dropped', 'Dropped'),
    )

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    # Progress tracking
    progress_percentage = models.IntegerField(default=0)
    last_accessed = models.DateTimeField(auto_now=True)

    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = [['student', 'course']]
        ordering = ['-enrolled_at']

    def __str__(self):
        return f"{self.student.username} - {self.course.title}"


class Lesson(models.Model):
    """
    Lesson model for course content (text lessons and videos).
    """
    LESSON_TYPE_CHOICES = (
        ('text', 'Text'),
        ('video', 'Video'),
    )

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    order = models.IntegerField(default=0, help_text="Order within the course")

    lesson_type = models.CharField(max_length=20, choices=LESSON_TYPE_CHOICES, default='text')

    # Text content
    content = models.TextField(blank=True)

    # Video content
    video_url = models.URLField(blank=True, help_text="Video lesson URL")
    video_duration = models.IntegerField(default=0, help_text="Duration in minutes")

    # Additional resources
    resources = models.JSONField(default=list, blank=True, help_text="Additional resources (downloads, links)")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"
