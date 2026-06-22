import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/layout.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const role = user?.role || 'employee';

  const adminMenuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Employees', path: '/admin/employees', icon: '👥' },
    { label: 'Departments', path: '/admin/departments', icon: '🏢' },
    { label: 'Leave Mgmt', path: '/admin/leaves', icon: '📋' },
    { label: 'Salary Mgmt', path: '/admin/salary', icon: '💰' },
    { label: 'Attendance', path: '/admin/attendance', icon: '📅' },
    { label: 'Reports', path: '/admin/reports', icon: '📈' },
  ];

  const employeeMenuItems = [
    { label: 'Dashboard', path: '/employee/dashboard', icon: '📊' },
    { label: 'Profile', path: '/employee/profile', icon: '👤' },
    { label: 'Attendance', path: '/employee/attendance', icon: '📅' },
    { label: 'Apply Leave', path: '/employee/apply-leave', icon: '📋' },
    { label: 'Leave History', path: '/employee/leave-history', icon: '📖' },
    { label: 'Salary View', path: '/employee/salary', icon: '💰' },
    { label: 'Department', path: '/employee/department', icon: '🏢' },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : employeeMenuItems;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-text">⚡ ERP PORTAL</span>
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button
          onClick={logout}
          className="sidebar-link"
          style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
        >
          <span className="sidebar-link-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
