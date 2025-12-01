import React, { useEffect, useState } from "react";
import { fetchCourses } from "../api/courseApi";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetchCourses();
        const coursesData = res.data?.results || res.data || [];
        const coursesArray = Array.isArray(coursesData) ? coursesData : [];
        
        if (coursesArray.length === 0) {
          console.warn("No courses returned from API");
        }
        
        setCourses(coursesArray);
        setFilteredCourses(coursesArray);
      } catch (e) {
        console.error("Failed to fetch courses:", e);
        console.error("Error details:", e.response?.data || e.message);
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter courses whenever search term or filters change
  useEffect(() => {
    let filtered = [...courses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (course) => course.category === selectedCategory
      );
    }

    // Level filter (backend uses lowercase: beginner/intermediate/advanced)
    if (selectedLevel !== "all") {
      filtered = filtered.filter(
        (course) => course.level === selectedLevel.toLowerCase()
      );
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedCategory, selectedLevel, courses]);

  // Extract unique categories from courses
  const categories = [
    "all",
    ...new Set(courses.map((c) => c.category).filter(Boolean)),
  ];
  const levels = ["all", "Beginner", "Intermediate", "Advanced"];

  if (loading) return <LoadingSpinner size="large" text="Loading courses..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Explore Courses
        </h1>
        <p className="text-gray-600">
          Discover and enroll in courses that match your interests
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-3">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-end">
            <p className="text-sm text-gray-600">
              Showing {filteredCourses.length} of {courses.length} courses
            </p>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {courses.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">
            No courses available at the moment.
          </p>
          <p className="text-gray-400 text-sm">
            Check back later or contact an instructor to create courses.
          </p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No courses found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedLevel("all");
            }}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
