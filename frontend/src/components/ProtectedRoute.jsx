import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { me } from '../api/authApi';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute - Ensures user is authenticated before accessing protected pages.
 * Redirects to login if not authenticated.
 */
export default function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Check if we have a token but no user data
    const token = localStorage.getItem('access_token');
    
    if (!user && token && !checking) {
      setChecking(true);
      // Try to fetch user data
      me()
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setLoading(false);
        })
        .finally(() => {
          setChecking(false);
        });
    } else if (!token) {
      // No token, no need to check
      setLoading(false);
    } else if (user) {
      // User already loaded
      setLoading(false);
    }
  }, [user, setUser, checking]);

  if (loading) {
    return <LoadingSpinner size="large" text="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}