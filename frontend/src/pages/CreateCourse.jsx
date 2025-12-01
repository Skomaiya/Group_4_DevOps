import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCourse, updateCourse, fetchCourse } from "../api/courseApi";
import { useAuthStore } from "../store/authStore";
import useToast from "../hooks/useToast";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CreateCourse() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(!!courseId);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    level: "beginner",
    duration_hours: 0,
    thumbnail: "",
    preview_video_url: "",
    status: "draft",
    is_featured: false,
    price: 0,
  });

  React.useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const res = await fetchCourse(courseId);
      const course = res.data;
      
      if (!course) {
        throw new Error("Course data not found");
      }
      
      setForm({
        title: course.title || "",
        slug: course.slug || "",
        description: course.description || "",
        category: course.category || "",
        level: course.level || "beginner",
        duration_hours: course.duration_hours || 0,
        thumbnail: course.thumbnail || "",
        preview_video_url: course.preview_video_url || "",
        status: course.status || "draft",
        is_featured: course.is_featured || false,
        price: course.price || 0,
      });
    } catch (e) {
      console.error("Failed to load course:", e);
      showToast("Failed to load course. Redirecting to dashboard.", "error");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      showToast("Title and description are required", "error");
      return;
    }

    // Generate slug from title if not provided
    if (!form.slug) {
      form.slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    setSaving(true);
    try {
      if (courseId) {
        await updateCourse(courseId, form);
        showToast("Course updated successfully!", "success");
        // Navigate to dashboard after update
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        const res = await createCourse(form);
        const newCourseId = res.data?.id || res.data?.pk || res.data?.course?.id;
        
        if (!newCourseId) {
          console.error("Course creation response:", res.data);
          showToast("Course created but could not get course ID. Redirecting to dashboard.", "warning");
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          showToast("Course created successfully!", "success");
          // Navigate to edit page after a short delay to ensure data is saved
          setTimeout(() => {
            navigate(`/courses/${newCourseId}/edit`);
          }, 500);
        }
      }
    } catch (err) {
      console.error("Course save error:", err);
      showToast(
        err.response?.data?.detail || err.message || "Failed to save course",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner size="large" text="Loading course..." />;

  if (user?.role !== "instructor") {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Only instructors can create courses.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {courseId ? "Edit Course" : "Create New Course"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (auto-generated if empty)
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="course-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Programming, Design"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (hours)
              </label>
              <input
                type="number"
                value={form.duration_hours}
                onChange={(e) =>
                  setForm({ ...form, duration_hours: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail URL
            </label>
            <input
              type="url"
              value={form.thumbnail}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preview Video URL
            </label>
            <input
              type="url"
              value={form.preview_video_url}
              onChange={(e) =>
                setForm({ ...form, preview_video_url: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) =>
                    setForm({ ...form, is_featured: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Featured Course</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : courseId ? "Update Course" : "Create Course"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

