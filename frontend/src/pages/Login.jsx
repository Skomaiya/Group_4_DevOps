import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, me } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);

    // Basic validation
    if (!form.email || !form.password) {
      setErr("Please fill in all fields");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErr("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // Clear any existing tokens before attempting new login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      
      // Send email and password to backend
      const res = await login({
        email: form.email,
        password: form.password,
      });
      const token = res.data.access || res.data.token || res.data.access_token;
      
      if (!token) {
        setErr("Login failed: No token received from server.");
        return;
      }
      
      localStorage.setItem("access_token", token);
      
      // Store refresh token if provided
      if (res.data.refresh) {
        localStorage.setItem("refresh_token", res.data.refresh);
      }
      
      // Use user data from login response if available, otherwise fetch it
      if (res.data.user && res.data.user.role) {
        setUser(res.data.user);
      } else {
        // Fallback: fetch user data
        try {
          const u = await me();
          setUser(u.data);
        } catch (e) {
          console.error("Failed to fetch user:", e);
          // If we can't fetch user, clear token and show error
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setErr("Login successful but failed to load user data. Please try again.");
          return;
        }
      }
      navigate("/dashboard");
    } catch (e) {
      // Clear tokens on error
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setErr(
        e.response?.data?.detail ||
          e.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-3 text-gray-600">
              Sign in to continue to LearnHub
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-6">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                  Forgot password?
                </a>
              </div>
            </div>

            {err && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {err}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Purple Gradient Background */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-purple-400 via-purple-500 to-purple-600 items-center justify-center p-12 relative overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-200 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-white max-w-md">
          <h1 className="text-5xl font-bold mb-6">LearnHub</h1>
          <p className="text-xl mb-8 text-purple-100">
            Unlock your potential with our comprehensive learning platform
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">1000+ Courses</h3>
                <p className="text-purple-100 text-sm">Learn from industry experts</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">50,000+ Students</h3>
                <p className="text-purple-100 text-sm">Join our learning community</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Certified Learning</h3>
                <p className="text-purple-100 text-sm">Get recognized certificates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}