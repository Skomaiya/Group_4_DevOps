import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { fetchProfile, updateProfile, updateUser, me } from "../api/authApi";
import LoadingSpinner from "../components/LoadingSpinner";
import useToast from "../hooks/useToast";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    // User fields
    username: "",
    email: "",
    phone_number: "",
    country: "",
    city: "",
    // Profile fields
    bio: "",
    expertise: "",
    credentials: "",
    profile_picture: "",
    linkedin_url: "",
    github_url: "",
    website: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadProfile = async () => {
    try {
      // Load user data
      const userData = user || (await me()).data;
      
      // Load profile data
      const profileRes = await fetchProfile();
      setProfile(profileRes.data);
      
      // Set form data with both user and profile fields
      setFormData({
        // User fields
        username: userData.username || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        country: userData.country || "",
        city: userData.city || "",
        // Profile fields
        bio: profileRes.data.bio || "",
        expertise: profileRes.data.expertise || "",
        credentials: profileRes.data.credentials || "",
        profile_picture: profileRes.data.profile_picture || "",
        linkedin_url: profileRes.data.linkedin_url || "",
        github_url: profileRes.data.github_url || "",
        website: profileRes.data.website || "",
      });
    } catch (e) {
      console.error("Failed to fetch profile:", e);
      showToast("Failed to load profile data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    
    try {
      // Separate user and profile data
      const userData = {
        username: formData.username,
        email: formData.email,
        phone_number: formData.phone_number,
        country: formData.country,
        city: formData.city,
      };
      
      const profileData = {
        bio: formData.bio,
        expertise: formData.expertise,
        credentials: formData.credentials,
        profile_picture: formData.profile_picture,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        website: formData.website,
      };
      
      // Update both user and profile
      const [userRes, profileRes] = await Promise.all([
        updateUser(userData),
        updateProfile(profileData),
      ]);
      
      // Update user in store
      setUser(userRes.data);
      
      showToast("Profile updated successfully!", "success");
      setIsEditing(false);
      await loadProfile(); // Reload profile data
    } catch (err) {
      console.error("Profile update error:", err);
      const errorMsg = err.response?.data?.detail || 
                      Object.values(err.response?.data || {}).flat().join(", ") ||
                      "Failed to update profile";
      showToast(errorMsg, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      country: user?.country || "",
      city: user?.city || "",
      bio: profile?.bio || "",
      expertise: profile?.expertise || "",
      credentials: profile?.credentials || "",
      profile_picture: profile?.profile_picture || "",
      linkedin_url: profile?.linkedin_url || "",
      github_url: profile?.github_url || "",
      website: profile?.website || "",
    });
    setIsEditing(false);
    setMessage("");
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) =>
                        setFormData({ ...formData, phone_number: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Nigeria"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Lagos"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Information Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Profile Information
                </h3>
                <div className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Picture URL
                    </label>
                    <input
                      type="url"
                      value={formData.profile_picture}
                      onChange={(e) =>
                        setFormData({ ...formData, profile_picture: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://example.com/profile.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin_url}
                        onChange={(e) =>
                          setFormData({ ...formData, linkedin_url: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={formData.github_url}
                        onChange={(e) =>
                          setFormData({ ...formData, github_url: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://github.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
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
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-800 font-medium">
                      {user?.phone_number || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="text-gray-800 font-medium">
                      {user?.country || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="text-gray-800 font-medium">
                      {user?.city || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-gray-800 font-medium capitalize">
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
                  {(profile?.linkedin_url || profile?.github_url || profile?.website) && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-2">Social Links</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.linkedin_url && (
                          <a
                            href={profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            LinkedIn
                          </a>
                        )}
                        {profile.github_url && (
                          <a
                            href={profile.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-700 text-sm"
                          >
                            GitHub
                          </a>
                        )}
                        {profile.website && (
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700 text-sm"
                          >
                            Website
                          </a>
                        )}
                      </div>
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
                      {(() => {
                        // Try date_joined first (from AbstractUser), then created_at (from custom User model)
                        const joinDate = user?.date_joined || user?.created_at;
                        if (!joinDate) return "N/A";
                        
                        try {
                          const date = new Date(joinDate);
                          // Check if date is valid
                          if (isNaN(date.getTime())) {
                            // If invalid, try to extract year from string
                            const yearMatch = joinDate.toString().match(/\d{4}/);
                            return yearMatch ? yearMatch[0] : "N/A";
                          }
                          // Format: "Month Day, Year" (e.g., "January 15, 2024")
                          // This always includes the year
                          return date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          });
                        } catch (e) {
                          // Fallback: try to extract year from the date string
                          const yearMatch = joinDate.toString().match(/\d{4}/);
                          return yearMatch ? yearMatch[0] : "N/A";
                        }
                      })()}
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