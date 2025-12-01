import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * PublicRoute - Redirects authenticated users away from public pages (login/register)
 * to prevent them from accessing these pages when already logged in.
 */
export default function PublicRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

