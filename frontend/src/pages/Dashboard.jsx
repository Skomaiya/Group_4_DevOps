import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { fetchCourses, fetchEnrollments } from "../api/courseApi";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHours: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        if (user?.role === "instructor") {
          // For instructors, fetch all courses and filter their own
          const coursesRes = await fetchCourses();
          const allCoursesData = coursesRes.data?.results || coursesRes.data || [];
          const allCourses = Array.isArray(allCoursesData) ? allCoursesData : [];
          const myCourses = allCourses.filter(
            (c) => {
              if (!c) return false;
              return (c.instructor && (c.instructor.id === user.id || c.instructor.username === user.username)) ||
                     c.instructor_username === user.username ||
                     c.instructor_id === user.id;
            }
          );
          setEnrollments(myCourses.map(c => ({ course: c, id: c.id })));
          setCourses(myCourses.slice(0, 3));
        } else {
          // For students, fetch enrollments
          const enrollmentsRes = await fetchEnrollments();
          const userEnrollments = Array.isArray(enrollmentsRes.data) 
            ? enrollmentsRes.data 
            : enrollmentsRes.data?.results || [];
          setEnrollments(userEnrollments);

          // Fetch courses for "continue learning" section
          const coursesRes = await fetchCourses();
          const coursesData = coursesRes.data?.results || coursesRes.data || [];
          const coursesArray = Array.isArray(coursesData) ? coursesData : [];
          setCourses(coursesArray.slice(0, 3));

          // Calculate stats from enrollments
          const completed = userEnrollments.filter(
            (e) => e.status === "completed"
          ).length;
          const inProgress = userEnrollments.filter(
            (e) => e.status === "active"
          ).length;
          const totalHours = userEnrollments.reduce((sum, e) => {
            return sum + (e.course?.duration_hours || 0);
          }, 0);

          setStats({
            enrolledCourses: userEnrollments.length,
            completedCourses: completed,
            inProgressCourses: inProgress,
            totalHours: Math.round(totalHours),
          });
        }
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
        setStats({
          enrolledCourses: 0,
          completedCourses: 0,
          inProgressCourses: 0,
          totalHours: 0,
        });
      }
      setLoading(false);
    })();
  }, [user]);

  if (loading)
    return <LoadingSpinner size="large" text="Loading dashboard..." />;

  // Instructor dashboard
  if (user?.role === "instructor") {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.username || "Instructor"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your courses and students
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/courses/create"
                className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center"
              >
                Create New Course
              </Link>
              <Link
                to="/courses"
                className="block w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-center"
              >
                Browse All Courses
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              My Courses
            </h3>
            {enrollments.length === 0 ? (
              <p className="text-gray-500">
                You haven't created any courses yet. Create your first course to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {enrollments.map((enrollment) => {
                  if (!enrollment) return null;
                  const course = enrollment.course || enrollment;
                  if (!course || !course.id) return null;
                  
                  return (
                    <div
                      key={enrollment.id || course.id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {course.title || "Untitled Course"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {course.enrolled_students_count || 0} students enrolled
                            {course.status && ` • ${course.status}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/courses/${course.id}`}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                          >
                            View
                          </Link>
                          <Link
                            to={`/courses/${course.id}/edit`}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Student dashboard
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.username || user?.first_name || "User"}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your learning journey
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                Enrolled Courses
              </p>
              <p className="text-3xl font-bold mt-2">{stats.enrolledCourses}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-50 rounded-full p-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold mt-2">
                {stats.completedCourses}
              </p>
            </div>
            <div className="bg-green-400 bg-opacity-50 rounded-full p-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold mt-2">
                {stats.inProgressCourses}
              </p>
            </div>
            <div className="bg-yellow-400 bg-opacity-50 rounded-full p-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Learning Hours
              </p>
              <p className="text-3xl font-bold mt-2">{stats.totalHours}</p>
            </div>
            <div className="bg-purple-400 bg-opacity-50 rounded-full p-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent/Continue Learning Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Continue Learning
          </h2>
          <Link
            to="/courses"
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            View all courses →
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              You haven't enrolled in any courses yet
            </p>
            <Link
              to="/courses"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-block"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-800 mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {course.short_description || course.description}
                </p>
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          <Link
            to="/courses"
            className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="bg-purple-100 rounded-lg p-2 mr-3">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <span className="text-gray-700">Browse All Courses</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="bg-green-100 rounded-lg p-2 mr-3">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-gray-700">Edit Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
