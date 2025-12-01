from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.utils import timezone
from django.db.models import Q
from drf_spectacular.utils import extend_schema

from api.models.course import Course, Lesson, Enrollment
from api.serializers.course_serializers import (
    CourseSerializer, CourseCreateSerializer, CourseListSerializer,
    LessonSerializer, LessonCreateSerializer,
    EnrollmentSerializer, EnrollmentCreateSerializer
)
from api.permissions import IsInstructor, IsCourseOwner


@extend_schema(tags=["Courses"])
class CourseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing courses.
    - List/Retrieve: Anyone can view published courses
    - Create: Only instructors
    - Update/Delete: Only course owner
    """
    queryset = Course.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'level', 'category', 'is_featured']
    search_fields = ['title', 'description', 'category']
    ordering_fields = ['created_at', 'price', 'enrolled_students_count']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update' or self.action == 'partial_update':
            return CourseCreateSerializer
        elif self.action == 'list':
            return CourseListSerializer
        return CourseSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticatedOrReadOnly]
        elif self.action == 'create':
            permission_classes = [IsAuthenticated, IsInstructor]
        else:  # update, delete, etc.
            permission_classes = [IsAuthenticated, IsCourseOwner]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Optionally restricts the returned courses.
        - Published courses are visible to everyone (authenticated users)
        - Draft courses are only visible to the course instructor
        """
        queryset = Course.objects.select_related('instructor').all()

        # For unauthenticated users, only show published courses
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(status='published')
        # For students, only show published courses
        elif self.request.user.role == 'student':
            queryset = queryset.filter(status='published')
        # For instructors, show their own courses (draft or published) + all published courses
        elif self.request.user.role == 'instructor':
            queryset = queryset.filter(
                Q(instructor=self.request.user) | Q(status='published')
            )
        # For other roles (admin, etc.), show all courses
        else:
            queryset = queryset.all()

        return queryset

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated, IsInstructor])
    def my_students(self, request, pk=None):
        """
        Get all enrollments for a specific course (instructor only).
        """
        course = self.get_object()
        if course.instructor != request.user:
            return Response(
                {"detail": "You don't have permission to view students for this course."},
                status=status.HTTP_403_FORBIDDEN
            )

        enrollments = Enrollment.objects.filter(course=course)
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, pk=None):
        """
        Enroll in a course (students only).
        """
        if request.user.role != 'student':
            return Response(
                {"detail": "Only students can enroll in courses."},
                status=status.HTTP_403_FORBIDDEN
            )

        course = self.get_object()

        # Check if already enrolled
        enrollment, created = Enrollment.objects.get_or_create(
            student=request.user,
            course=course,
            defaults={'status': 'active'}
        )

        if not created:
            return Response(
                {"detail": "You are already enrolled in this course."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update counts
        course.enrolled_students_count += 1
        course.save()

        if hasattr(request.user, 'profile'):
            request.user.profile.enrolled_courses_count += 1
            request.user.profile.save()

        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@extend_schema(tags=["Lessons"])
class LessonViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing lessons within courses.
    - List/Retrieve: Anyone can view lessons of published courses
    - Create/Update/Delete: Only course instructor
    """
    queryset = Lesson.objects.all()

    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update' or self.action == 'partial_update':
            return LessonCreateSerializer
        return LessonSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticatedOrReadOnly]
        else:
            permission_classes = [IsAuthenticated, IsInstructor]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Filter lessons by course visibility
        """
        queryset = Lesson.objects.select_related('course', 'course__instructor').all()

        # Filter out lessons from unpublished courses for non-owners
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(course__status='published')
        elif self.request.user.role != 'instructor':
            queryset = queryset.filter(course__status='published')
        elif self.request.user.role == 'instructor':
            # Instructors can see lessons from their own courses or published courses
            queryset = queryset.filter(
                course__instructor=self.request.user
            ) | Lesson.objects.filter(course__status='published')

        return queryset

    def perform_create(self, serializer):
        course = serializer.validated_data['course']
        if course.instructor != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only add lessons to your own courses.")
        serializer.save()


@extend_schema(tags=["Enrollments"])
class EnrollmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing student enrollments.
    - List: Students see their own enrollments
    - Retrieve: Enrolled students or course instructor
    - Create: Students can enroll in courses
    - Update: Only for updating progress (students themselves)
    """
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Students can only see their own enrollments.
        Instructors can see enrollments in their courses.
        """
        if self.request.user.role == 'student':
            return Enrollment.objects.filter(student=self.request.user)
        elif self.request.user.role == 'instructor':
            # Instructors can see enrollments in their courses
            return Enrollment.objects.filter(course__instructor=self.request.user)
        return Enrollment.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return EnrollmentCreateSerializer
        return EnrollmentSerializer

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_progress(self, request, pk=None):
        """
        Update enrollment progress (students only).
        """
        enrollment = self.get_object()

        if enrollment.student != request.user:
            return Response(
                {"detail": "You can only update your own enrollment progress."},
                status=status.HTTP_403_FORBIDDEN
            )

        progress = request.data.get('progress_percentage', 0)
        if progress < 0 or progress > 100:
            return Response(
                {"detail": "Progress must be between 0 and 100."},
                status=status.HTTP_400_BAD_REQUEST
            )

        enrollment.progress_percentage = progress

        # Auto-update status to completed if progress is 100%
        if progress >= 100:
            if enrollment.status != 'completed':
                enrollment.status = 'completed'
                enrollment.completed_at = timezone.now()

                # Update student's completed courses count
                if hasattr(request.user, 'profile'):
                    request.user.profile.completed_courses_count += 1
                    request.user.profile.save()

        enrollment.save()
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data)
