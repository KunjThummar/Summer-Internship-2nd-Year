import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { DepartmentProvider } from './context/DepartmentContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { LeaveProvider } from './context/LeaveContext';
import { SalaryProvider } from './context/SalaryContext';
import { AttendanceProvider } from './context/AttendanceContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import EmployeeLayout from './layouts/EmployeeLayout';

// Route guards
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

// Pages - Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages - Admin
import AdminDashboard from './pages/admin/Dashboard';
import EmployeeList from './pages/admin/EmployeeList';
import AddEmployee from './pages/admin/AddEmployee';
import EditEmployee from './pages/admin/EditEmployee';
import EmployeeDetail from './pages/admin/EmployeeDetail';
import DepartmentList from './pages/admin/DepartmentList';
import AddDepartment from './pages/admin/AddDepartment';
import EditDepartment from './pages/admin/EditDepartment';
import LeaveManagement from './pages/admin/LeaveManagement';
import SalaryManagement from './pages/admin/SalaryManagement';
import SalaryHistory from './pages/admin/SalaryHistory';
import AttendanceManagement from './pages/admin/AttendanceManagement';
import Reports from './pages/admin/Reports';

// Pages - Employee
import EmployeeDashboard from './pages/employee/Dashboard';
import Profile from './pages/employee/Profile';
import Attendance from './pages/employee/Attendance';
import ApplyLeave from './pages/employee/ApplyLeave';
import LeaveHistory from './pages/employee/LeaveHistory';
import SalaryView from './pages/employee/SalaryView';
import DepartmentDetails from './pages/employee/DepartmentDetails';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DashboardProvider>
          <DepartmentProvider>
            <EmployeeProvider>
              <LeaveProvider>
                <SalaryProvider>
                  <AttendanceProvider>
                    <Routes>
                      {/* Public Auth Routes */}
                      <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                      </Route>

                      {/* Protected Routes */}
                      <Route element={<ProtectedRoute />}>
                        
                        {/* Admin Routes */}
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

                        {/* Employee Routes */}
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

                      {/* Fallback route */}
                      <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                  </AttendanceProvider>
                </SalaryProvider>
              </LeaveProvider>
            </EmployeeProvider>
          </DepartmentProvider>
        </DashboardProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
