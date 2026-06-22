import React from 'react';
import { Outlet } from 'react-router-dom';
import Toast from '../components/ui/Toast';
import '../styles/auth.css';

const AuthLayout = () => {
  return (
    <div className="auth-wrapper">
      <Outlet />
      <Toast />
    </div>
  );
};

export default AuthLayout;
