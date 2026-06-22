import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardContext } from '../../context/DashboardContext';
import StatCard from '../../components/StatCard';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import '../../styles/dashboard.css';

const Dashboard = () => {
  const { stats, loading, fetchAllStats } = useContext(DashboardContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats]);

  if (loading) {
    return <Loader message="Fetching dashboard statistics..." />;
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="stat-grid">
        <StatCard icon="👥" label="Total Employees" value={stats.totalEmployees} />
        <StatCard icon="🏢" label="Total Departments" value={stats.totalDepartments} />
        <StatCard icon="⌛" label="Pending Leaves" value={stats.pendingLeaves} trendDirection="down" />
        <StatCard icon="✅" label="Approved Leaves" value={stats.approvedLeaves} />
        <StatCard icon="💰" label="Total Salary Ledger" value={`$${stats.totalSalary.toLocaleString()}`} />
      </div>

      <div className="dashboard-sections" style={{ marginTop: '2rem' }}>
        <Card title="Quick Management Options">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Button onClick={() => navigate('/admin/employees/add')}>
              ➕ Add Employee
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin/attendance')}>
              📅 Mark Attendance
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin/departments/add')}>
              🏢 Add Department
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin/salary')}>
              💰 Process Salary
            </Button>
          </div>
        </Card>

        <Card title="System Alerts">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.pendingLeaves > 0 ? (
              <div style={{ borderLeft: '3px solid var(--warning)', paddingLeft: '0.75rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Pending Leaves Review</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  There are {stats.pendingLeaves} leave requests waiting for your decision.
                </p>
                <a
                  href="/admin/leaves"
                  style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'underline', display: 'block', marginTop: '0.25rem' }}
                >
                  Review requests &rarr;
                </a>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                ✓ No pending tasks or actions required.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
