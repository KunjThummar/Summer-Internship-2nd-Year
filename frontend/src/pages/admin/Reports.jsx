import React, { useContext, useEffect } from 'react';
import { DashboardContext } from '../../context/DashboardContext';
import { DepartmentContext } from '../../context/DepartmentContext';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Table from '../../components/ui/Table';

const Reports = () => {
  const { stats, loading: statsLoading, fetchAllStats } = useContext(DashboardContext);
  const { departments, fetchDepartments, loading: deptLoading } = useContext(DepartmentContext);

  useEffect(() => {
    fetchAllStats();
    fetchDepartments();
  }, [fetchAllStats, fetchDepartments]);

  if (statsLoading || deptLoading) {
    return <Loader message="Compiling executive reports..." />;
  }

  // Calculate leave percentages
  const totalLeaves = stats.approvedLeaves + stats.pendingLeaves + stats.rejectedLeaves;
  const approvalRate = totalLeaves > 0 ? ((stats.approvedLeaves / totalLeaves) * 100).toFixed(1) : '0';

  const deptColumns = [
    { header: 'Department', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="stat-grid" style={{ marginBottom: '2rem' }}>
        <Card title="Organization Staffing">
          <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
            {stats.totalEmployees}
          </p>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Active staff members on payroll</span>
        </Card>

        <Card title="Department Divisions">
          <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--secondary)', margin: 0 }}>
            {stats.totalDepartments}
          </p>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Registered functional divisions</span>
        </Card>

        <Card title="Leave Approval Rate">
          <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success)', margin: 0 }}>
            {approvalRate}%
          </p>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Approved requests ratio ({stats.approvedLeaves} of {totalLeaves})</span>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <Card title="Registered Departments Details">
          <Table columns={deptColumns} data={departments} emptyMessage="No departments registered." />
        </Card>
      </div>
    </div>
  );
};

export default Reports;
