import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { fetchProfile, updateProfile } from "../api/authApi";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    bio: "",
    expertise: "",
    credentials: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetchProfile();
      setProfile(res.data);
      setFormData({
        bio: res.data.bio || "",
        expertise: res.data.expertise || "",
        credentials: res.data.credentials || "",
      });
    } catch (e) {
      console.error("Failed to fetch profile:", e);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      loadProfile(); // Reload profile data
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to update profile");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCancel = () => {
    setFormData({
      bio: profile?.bio || "",
      expertise: profile?.expertise || "",
      credentials: profile?.credentials || "",
    });
    setIsEditing(false);
  };

  if (loading) return <LoadingSpinner size="large" text="Loading profile..." />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="bg-linear-to-r from-purple-500 to-purple-600 h-32 rounded-t-lg"></div>

        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
              {(user?.username || "U")[0].toUpperCase()}
            </div>
            <div className="ml-6 mt-16">
              <h1 className="text-2xl font-bold text-gray-800">
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.username || "User"}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="ml-auto mt-16 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {message}
            </div>
          )}

          {/* Profile Form */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expertise
                </label>
                <input
                  type="text"
                  value={formData.expertise}
                  onChange={(e) =>
                    setFormData({ ...formData, expertise: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Web Development, Data Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credentials
                </label>
                <input
                  type="text"
                  value={formData.credentials}
                  onChange={(e) =>
                    setFormData({ ...formData, credentials: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., BSc Computer Science, AWS Certified"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Profile Information Display */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Profile Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="text-gray-800 font-medium">
                      {user?.username || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium">
                      {user?.email || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">First Name</p>
                    <p className="text-gray-800 font-medium">
                      {user?.first_name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Name</p>
                    <p className="text-gray-800 font-medium">
                      {user?.last_name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-gray-800 font-medium">
                      {user?.role || "student"}
                    </p>
                  </div>
                  {profile?.expertise && (
                    <div>
                      <p className="text-sm text-gray-500">Expertise</p>
                      <p className="text-gray-800 font-medium">
                        {profile.expertise}
                      </p>
                    </div>
                  )}
                  {profile?.credentials && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Credentials</p>
                      <p className="text-gray-800 font-medium">
                        {profile.credentials}
                      </p>
                    </div>
                  )}
                </div>
                {profile?.bio && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Bio</p>
                    <p className="text-gray-800">{profile.bio}</p>
                  </div>
                )}
              </div>

              {/* Account Details */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Account Details
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member since</span>
                    <span className="text-gray-800 font-medium">
                      {user?.date_joined
                        ? new Date(user.date_joined).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Status</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
