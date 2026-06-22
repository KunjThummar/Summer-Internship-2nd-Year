import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Toast from '../components/ui/Toast';
import '../styles/layout.css';

const AdminLayout = () => {
  const location = useLocation();

  const getTitle = (pathname) => {
    if (pathname.includes('/admin/dashboard')) return 'Admin Dashboard';
    if (pathname.includes('/admin/employees/add')) return 'Add New Employee';
    if (pathname.includes('/admin/employees/edit')) return 'Modify Employee';
    if (pathname.includes('/admin/employees/')) return 'Employee Profile details';
    if (pathname.includes('/admin/employees')) return 'Employee Directory';
    if (pathname.includes('/admin/departments/add')) return 'Add New Department';
    if (pathname.includes('/admin/departments/edit')) return 'Modify Department';
    if (pathname.includes('/admin/departments')) return 'Department Records';
    if (pathname.includes('/admin/leaves')) return 'Leave Allocations';
    if (pathname.includes('/admin/salary/history')) return 'Employee Salary Ledger';
    if (pathname.includes('/admin/salary')) return 'Salary Management';
    if (pathname.includes('/admin/attendance')) return 'Attendance Logging';
    if (pathname.includes('/admin/reports')) return 'Executive Reports';
    return 'ERP Admin Panel';
  };

  return (
    <div className="layout-wrapper">
      <Sidebar />
      <div className="main-content">
        <Topbar title={getTitle(location.pathname)} />
        <main className="main-wrapper">
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  );
};

export default AdminLayout;
