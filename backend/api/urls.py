from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from api.views.user_views import UserViewSet, ProfileViewSet
from api.views.user_views import CurrentUserView, CurrentUserProfileView
from api.views.auth_views import RegisterView, LoginView, LogoutView
from api.views.course_views import CourseViewSet, LessonViewSet, EnrollmentViewSet

router = DefaultRouter()

# Register ViewSets
router.register(r'users', UserViewSet, basename='users')
router.register(r'profiles', ProfileViewSet, basename='profiles')
router.register(r'courses', CourseViewSet, basename='courses')
router.register(r'lessons', LessonViewSet, basename='lessons')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollments')


urlpatterns = [
    path('', include(router.urls)),
    path('user/', CurrentUserView.as_view(), name='current-user'),
    path('profile/', CurrentUserProfileView.as_view(), name='current-user-profile'),

    # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
]
