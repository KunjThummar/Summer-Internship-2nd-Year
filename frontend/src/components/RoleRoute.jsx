import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from './ui/Loader';

const RoleRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Authorizing role access..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = allowedRoles.includes(user.role);

  if (!hasRole) {
    // Redirect unauthorized user to their default dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'employee') {
      return <Navigate to="/employee/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default RoleRoute;
