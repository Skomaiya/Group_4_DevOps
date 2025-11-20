import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCourse } from "../api/courseApi";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuthStore } from "../store/authStore";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCourse(id);
        setCourse(res.data);
        // Check if user is enrolled (mock for now)
        setEnrolled(Math.random() > 0.5);
      } catch (e) {
        console.error("Failed to fetch course:", e);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading)
    return <LoadingSpinner size="large" text="Loading course details..." />;
  if (!course)
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Course not found</p>
        <Link
          to="/courses"
          className="mt-4 inline-block text-indigo-600 hover:text-indigo-700"
        >
          ← Back to courses
        </Link>
      </div>
    );

  const imageUrl =
    course.image ||
    course.thumbnail ||
    "https://via.placeholder.com/1200x400?text=Course+Banner";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Link
            to="/courses"
            className="inline-flex items-center text-indigo-200 hover:text-white mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to courses
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              {course.category && (
                <span className="inline-block px-3 py-1 bg-indigo-500 rounded-full text-sm font-semibold mb-4">
                  {course.category}
                </span>
              )}
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-indigo-100 text-lg mb-6">
                {course.short_description ||
                  course.description?.substring(0, 150)}
              </p>

              <div className="flex items-center gap-6 mb-6">
                {course.rating && (
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-xl">⭐</span>
                    <span className="ml-2 text-lg font-semibold">
                      {course.rating}
                    </span>
                  </div>
                )}
                {course.students_count && (
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span>{course.students_count} students enrolled</span>
                  </div>
                )}
                {course.difficulty && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      course.difficulty === "Beginner"
                        ? "bg-green-500"
                        : course.difficulty === "Intermediate"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {course.difficulty}
                  </span>
                )}
              </div>

              {user ? (
                <button
                  onClick={() => setEnrolled(!enrolled)}
                  className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                    enrolled
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-white text-indigo-600 hover:bg-gray-100"
                  }`}
                >
                  {enrolled ? "✓ Enrolled" : "Enroll Now"}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Sign in to Enroll
                </Link>
              )}
            </div>
            <div className="hidden lg:block">
              <img
                src={imageUrl}
                alt={course.title}
                className="rounded-lg shadow-2xl"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600x400?text=Course+Image";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                About This Course
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {course.description ||
                  course.long_description ||
                  "No detailed description available."}
              </p>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                What You'll Learn
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(
                  course.learning_objectives || [
                    "Master the fundamentals",
                    "Build real-world projects",
                    "Best practices and patterns",
                    "Advanced techniques",
                  ]
                ).map((objective, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-0.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Course Curriculum */}
            {course.modules && course.modules.length > 0 && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Course Curriculum
                </h2>
                <div className="space-y-3">
                  {course.modules.map((module, idx) => (
                    <div
                      key={idx}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-800">
                        {module.title || `Module ${idx + 1}`}
                      </h3>
                      {module.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {module.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Course Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3 mt-0.5"
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
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-800">
                      {course.duration || "8 weeks"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3 mt-0.5"
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
                  <div>
                    <p className="text-sm text-gray-500">Skill Level</p>
                    <p className="font-semibold text-gray-800">
                      {course.difficulty || "All Levels"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Language</p>
                    <p className="font-semibold text-gray-800">
                      {course.language || "English"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3 mt-0.5"
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
                  <div>
                    <p className="text-sm text-gray-500">Lessons</p>
                    <p className="font-semibold text-gray-800">
                      {course.lessons_count || "24"} lessons
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Share this course
                </h4>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                    Facebook
                  </button>
                  <button className="flex-1 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-sm">
                    Twitter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
