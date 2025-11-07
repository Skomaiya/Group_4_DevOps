from rest_framework import serializers
from api.models.course import Course, Lesson, Enrollment
from api.serializers.user_serializers import UserSerializer


class LessonSerializer(serializers.ModelSerializer):
    """Serializer for Lesson model"""
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'course', 'title', 'order', 'lesson_type',
            'content', 'video_url', 'video_duration', 'resources',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class LessonCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating lessons (instructor only)"""
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'course', 'title', 'order', 'lesson_type',
            'content', 'video_url', 'video_duration', 'resources'
        ]


class CourseSerializer(serializers.ModelSerializer):
    """Detailed course serializer with instructor info and lessons"""
    instructor = UserSerializer(read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    lessons_count = serializers.IntegerField(source='lessons.count', read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'description', 'instructor',
            'category', 'level', 'duration_hours', 'thumbnail',
            'preview_video_url', 'status', 'is_featured', 'price',
            'enrolled_students_count', 'lessons', 'lessons_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['enrolled_students_count', 'created_at', 'updated_at']


class CourseCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating courses (instructor only)"""
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'description',
            'category', 'level', 'duration_hours', 'thumbnail',
            'preview_video_url', 'status', 'is_featured', 'price'
        ]

    def create(self, validated_data):
        # Set instructor to the current user
        validated_data['instructor'] = self.context['request'].user
        return super().create(validated_data)


class CourseListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing courses"""
    instructor_username = serializers.CharField(source='instructor.username', read_only=True)
    lessons_count = serializers.IntegerField(source='lessons.count', read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'description', 'instructor_username',
            'category', 'level', 'duration_hours', 'thumbnail',
            'status', 'is_featured', 'price', 'enrolled_students_count',
            'lessons_count', 'created_at'
        ]
        read_only_fields = ['enrolled_students_count', 'created_at']


class EnrollmentSerializer(serializers.ModelSerializer):
    """Serializer for Enrollment model"""
    student = UserSerializer(read_only=True)
    course = CourseListSerializer(read_only=True)
    
    class Meta:
        model = Enrollment
        fields = [
            'id', 'student', 'course', 'status', 'progress_percentage',
            'last_accessed', 'enrolled_at', 'completed_at'
        ]
        read_only_fields = ['student', 'enrolled_at', 'last_accessed']


class EnrollmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating enrollments"""
    
    class Meta:
        model = Enrollment
        fields = ['course', 'status']

    def create(self, validated_data):
        # Set student to the current user
        validated_data['student'] = self.context['request'].user
        
        # Check if already enrolled
        enrollment, created = Enrollment.objects.get_or_create(
            student=validated_data['student'],
            course=validated_data['course'],
            defaults={'status': validated_data['status']}
        )
        
        if created:
            # Increment enrolled_students_count
            enrollment.course.enrolled_students_count += 1
            enrollment.course.save()
            
            # Update student's enrolled_courses_count
            if hasattr(validated_data['student'], 'profile'):
                validated_data['student'].profile.enrolled_courses_count += 1
                validated_data['student'].profile.save()
        
        return enrollment

