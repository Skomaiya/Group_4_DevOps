import React from "react";
import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  // Fallback image if course doesn't have one
  const imageUrl =
    course.thumbnail || "https://via.placeholder.com/400x250?text=Course+Image";

  // Map backend level to display format
  const levelMap = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };
  const displayLevel = levelMap[course.level] || course.level;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <img
        src={imageUrl}
        alt={course.title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/400x250?text=Course+Image";
        }}
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
            {course.category || "General"}
          </span>
          {course.level && (
            <span
              className={`text-xs px-2 py-1 rounded ${
                course.level === "beginner"
                  ? "bg-green-100 text-green-800"
                  : course.level === "intermediate"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {displayLevel}
            </span>
          )}
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {course.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {course.instructor && (
              <div className="flex items-center text-gray-500 text-xs">
                <svg
                  className="w-4 h-4 mr-1"
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
                {course.instructor.username}
              </div>
            )}
            {(course.enrolled_students_count || 0) > 0 && (
              <span className="text-xs text-gray-500">
                {course.enrolled_students_count || 0} students
              </span>
            )}
          </div>
          <Link
            to={`/courses/${course.id}`}
            className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
}
