import React, { createContext, useState, useCallback } from 'react';
import { dashboardService } from '../api/dashboardService';
import { leaveService } from '../api/leaveService';

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalary: 0,
    approvedLeaves: 0,
    pendingLeaves: 0,
    rejectedLeaves: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [empRes, deptRes, salRes, leaveCounts] = await Promise.all([
        dashboardService.fetchEmployeeCount().catch(() => ({ totalEmployees: 0 })),
        dashboardService.fetchDepartmentCount().catch(() => ({ totalDepartments: 0 })),
        dashboardService.fetchTotalSalary().catch(() => ({ Total_Salary: 0 })),
        leaveService.fetchLeaveCounts().catch(() => ({ approved: 0, pending: 0, rejected: 0 }))
      ]);

      setStats({
        totalEmployees: empRes.totalEmployees || 0,
        totalDepartments: deptRes.totalDepartments || 0,
        totalSalary: salRes.Total_Salary || 0,
        approvedLeaves: leaveCounts.approved || 0,
        pendingLeaves: leaveCounts.pending || 0,
        rejectedLeaves: leaveCounts.rejected || 0
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        stats,
        loading,
        error,
        fetchAllStats
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
