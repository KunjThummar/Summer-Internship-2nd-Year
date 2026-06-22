import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Toast from '../components/ui/Toast';
import '../styles/layout.css';

const EmployeeLayout = () => {
  const location = useLocation();

  const getTitle = (pathname) => {
    if (pathname.includes('/employee/dashboard')) return 'Employee Portal';
    if (pathname.includes('/employee/profile')) return 'My Profile details';
    if (pathname.includes('/employee/attendance')) return 'My Attendance Ledger';
    if (pathname.includes('/employee/apply-leave')) return 'Request Leave Absence';
    if (pathname.includes('/employee/leave-history')) return 'Leave Log';
    if (pathname.includes('/employee/salary')) return 'My Pay slips';
    if (pathname.includes('/employee/department')) return 'Department Details';
    return 'ERP Employee Dashboard';
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

export default EmployeeLayout;
