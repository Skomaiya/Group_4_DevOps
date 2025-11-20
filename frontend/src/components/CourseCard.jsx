import React from "react";
import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  // Fallback image if course doesn't have one
  const imageUrl =
    course.image ||
    course.thumbnail ||
    "https://via.placeholder.com/400x250?text=Course+Image";

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
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
            {course.category || "General"}
          </span>
          {course.difficulty && (
            <span
              className={`text-xs px-2 py-1 rounded ${
                course.difficulty === "Beginner"
                  ? "bg-green-100 text-green-800"
                  : course.difficulty === "Intermediate"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {course.difficulty}
            </span>
          )}
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {course.short_description || course.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {course.rating && (
              <div className="flex items-center text-yellow-500 text-sm">
                <span>⭐</span>
                <span className="ml-1 text-gray-700">{course.rating}</span>
              </div>
            )}
            {course.students_count && (
              <span className="ml-3 text-xs text-gray-500">
                {course.students_count} students
              </span>
            )}
          </div>
          <Link
            to={`/courses/${course.id}`}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
}
