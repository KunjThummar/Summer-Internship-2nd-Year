import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';

// Guard components
import ProtectedRoute from '../components/ProtectedRoute';
import RoleRoute from '../components/RoleRoute';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard';
import EmployeeList from '../pages/admin/EmployeeList';
import AddEmployee from '../pages/admin/AddEmployee';
import EditEmployee from '../pages/admin/EditEmployee';
import EmployeeDetail from '../pages/admin/EmployeeDetail';
import DepartmentList from '../pages/admin/DepartmentList';
import AddDepartment from '../pages/admin/AddDepartment';
import EditDepartment from '../pages/admin/EditDepartment';
import LeaveManagement from '../pages/admin/LeaveManagement';
import SalaryManagement from '../pages/admin/SalaryManagement';
import SalaryHistory from '../pages/admin/SalaryHistory';
import AttendanceManagement from '../pages/admin/AttendanceManagement';
import Reports from '../pages/admin/Reports';

// Employee pages
import EmployeeDashboard from '../pages/employee/Dashboard';
import Profile from '../pages/employee/Profile';
import Attendance from '../pages/employee/Attendance';
import ApplyLeave from '../pages/employee/ApplyLeave';
import LeaveHistory from '../pages/employee/LeaveHistory';
import SalaryView from '../pages/employee/SalaryView';
import DepartmentDetails from '../pages/employee/DepartmentDetails';

// Root redirect logic based on authentication and user role
const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return null; // The ProtectedRoute/RoleRoute loaders will handle full screens
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/employee/dashboard" replace />;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Root Route */}
      <Route path="/" element={<RootRedirect />} />

      {/* Auth / Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/employees" element={<EmployeeList />} />
            <Route path="/admin/employees/add" element={<AddEmployee />} />
            <Route path="/admin/employees/edit/:id" element={<EditEmployee />} />
            <Route path="/admin/employees/:id" element={<EmployeeDetail />} />
            <Route path="/admin/departments" element={<DepartmentList />} />
            <Route path="/admin/departments/add" element={<AddDepartment />} />
            <Route path="/admin/departments/edit/:id" element={<EditDepartment />} />
            <Route path="/admin/leaves" element={<LeaveManagement />} />
            <Route path="/admin/salary" element={<SalaryManagement />} />
            <Route path="/admin/salary/history/:employeeId" element={<SalaryHistory />} />
            <Route path="/admin/attendance" element={<AttendanceManagement />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Route>
        </Route>
      </Route>

      {/* Employee Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['employee']} />}>
          <Route element={<EmployeeLayout />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/profile" element={<Profile />} />
            <Route path="/employee/attendance" element={<Attendance />} />
            <Route path="/employee/apply-leave" element={<ApplyLeave />} />
            <Route path="/employee/leave-history" element={<LeaveHistory />} />
            <Route path="/employee/salary" element={<SalaryView />} />
            <Route path="/employee/department" element={<DepartmentDetails />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback to root redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
