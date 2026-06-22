import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LeaveContext } from '../../context/LeaveContext';
import { SalaryContext } from '../../context/SalaryContext';
import Card from '../../components/ui/Card';
import StatCard from '../../components/StatCard';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Table from '../../components/ui/Table';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { leaves, fetchLeaves, loading: leaveLoading } = useContext(LeaveContext);
  const { salaryHistory, fetchSalaryHistory, loading: salaryLoading } = useContext(SalaryContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id || user?.id) {
      const uid = user._id || user.id;
      fetchLeaves(uid);
      fetchSalaryHistory(uid);
    }
  }, [user, fetchLeaves, fetchSalaryHistory]);

  if (leaveLoading || salaryLoading) {
    return <Loader message="Setting up your portal..." />;
  }

  // Count personal leave statuses
  const pendingCount = leaves.filter((l) => l.status === 'pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'approved').length;
  const latestSalary = salaryHistory[0];

  const recentLeaves = leaves.slice(0, 3);

  const leaveColumns = [
    { header: 'Leave Type', accessor: 'leaveType' },
    {
      header: 'Start Date',
      render: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      header: 'End Date',
      render: (row) => new Date(row.endDate).toLocaleDateString(),
    },
    {
      header: 'Status',
      render: (row) => (
        <span style={{
          textTransform: 'capitalize',
          fontWeight: 600,
          color: row.status === 'approved' ? 'var(--success)' : row.status === 'rejected' ? 'var(--danger)' : 'var(--warning)'
        }}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          Welcome back, {user?.name || 'Employee'}!
        </h2>
        <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', fontSize: '0.95rem' }}>
          Here is a quick overview of your employment logs and applications.
        </p>
      </div>

      <div className="stat-grid">
        <StatCard icon="⌛" label="Pending Leave Requests" value={pendingCount} />
        <StatCard icon="✅" label="Approved Leave Requests" value={approvedCount} />
        <StatCard
          icon="💰"
          label="Last Net Paid"
          value={latestSalary ? `$${latestSalary.netSalary.toLocaleString()}` : '$0'}
        />
      </div>

      <div className="dashboard-sections" style={{ marginTop: '2rem' }}>
        <Card title="Recent Leave Requests" headerAction={
          <Button size="sm" onClick={() => navigate('/employee/apply-leave')}>
            Apply Leave
          </Button>
        }>
          <Table columns={leaveColumns} data={recentLeaves} emptyMessage="You haven't requested any leaves yet." />
        </Card>

        <Card title="Quick Actions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Button variant="secondary" onClick={() => navigate('/employee/profile')} style={{ justifyContent: 'flex-start' }}>
              👤 View My Profile
            </Button>
            <Button variant="secondary" onClick={() => navigate('/employee/attendance')} style={{ justifyContent: 'flex-start' }}>
              📅 My Attendance Logs
            </Button>
            <Button variant="secondary" onClick={() => navigate('/employee/salary')} style={{ justifyContent: 'flex-start' }}>
              💰 View Pay slips
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
