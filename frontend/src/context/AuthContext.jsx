import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';
import { employeeService } from '../api/employeeService';

export const AuthContext = createContext();

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('erp_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on load
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        const decoded = decodeToken(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          try {
            // Fetch the logged-in user profile details
            const data = await employeeService.fetchEmployee(decoded.id);
            if (data && data.employee) {
              setUser(data.employee);
            } else {
              setUser({ id: decoded.id, email: decoded.userEmail, role: decoded.role });
            }
          } catch (err) {
            // Fallback to basic decoded token details if profile fetch fails
            setUser({ id: decoded.id, email: decoded.userEmail, role: decoded.role });
          }
        } else {
          // Token expired
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('erp_token', data.jwt);
      setToken(data.jwt);

      const decoded = decodeToken(data.jwt);
      const userObj = { id: decoded.id, email: decoded.userEmail, role: decoded.role };
      setUser(userObj);
      
      // Try to load full profile
      try {
        const profile = await employeeService.fetchEmployee(decoded.id);
        if (profile && profile.employee) {
          setUser(profile.employee);
        }
      } catch (_) {}

      return userObj;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('erp_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        isEmployee: user?.role === 'employee'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
