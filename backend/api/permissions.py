from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admin users
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_staff


class IsStudent(permissions.BasePermission):
    """
    Custom permission to only allow students to perform certain actions
    """

    def has_permission(self, request, view):
        return request.user and request.user.role == 'student'


class IsInstructor(permissions.BasePermission):
    """
    Custom permission to only allow instructors to perform certain actions
    """

    def has_permission(self, request, view):
        return request.user and request.user.role == 'instructor'


class IsCourseOwner(permissions.BasePermission):
    """
    Permission to only allow course owners (instructors) to modify their courses
    """

    def has_object_permission(self, request, view, obj):
        return obj.instructor == request.user
