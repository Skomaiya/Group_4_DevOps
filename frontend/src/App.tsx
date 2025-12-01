// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateCourse from './pages/CreateCourse';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import { me } from './api/authApi';
import { useAuthStore } from './store/authStore';

export default function App() {
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    // Only fetch user if we have a token and no user data
    const token = localStorage.getItem('access_token');
    if (token && !user) {
      (async () => {
        try {
          const res = await me();
          setUser(res.data);
        } catch (e) {
          // Token is invalid, clear it
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          console.error('Failed to fetch user:', e);
        }
      })();
    }
  }, [setUser, user]);

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/create"
          element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id/edit"
          element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
