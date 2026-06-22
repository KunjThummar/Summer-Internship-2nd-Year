import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LeaveContext } from '../../context/LeaveContext';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/EmptyState';

const LeaveHistory = () => {
  const { user } = useContext(AuthContext);
  const { leaves, fetchLeaves, loading } = useContext(LeaveContext);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchLeaves(user._id || user.id);
    }
  }, [user, fetchLeaves]);

  if (loading && leaves.length === 0) {
    return <Loader message="Fetching leave history..." />;
  }

  // Filter leaves based on selected tab
  const filteredLeaves = leaves.filter((leave) => {
    if (filter === 'all') return true;
    return leave.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="active" text="Approved" />;
      case 'rejected':
        return <Badge variant="inactive" text="Rejected" />;
      default:
        return <Badge variant="warning" text="Pending" />;
    }
  };

  const calculateDays = (start, end) => {
    const diffTime = Math.abs(new Date(end) - new Date(start));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays === 1 ? '1 Day' : `${diffDays} Days`;
  };

  const columns = [
    {
      header: 'Leave Type',
      accessor: 'leaveType',
      render: (row) => <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{row.leaveType}</span>,
    },
    {
      header: 'Start Date',
      render: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      header: 'End Date',
      render: (row) => new Date(row.endDate).toLocaleDateString(),
    },
    {
      header: 'Duration',
      render: (row) => calculateDays(row.startDate, row.endDate),
    },
    {
      header: 'Reason',
      accessor: 'reason',
    },
    {
      header: 'Status',
      render: (row) => getStatusBadge(row.status),
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>My Leave History</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', fontSize: '0.95rem' }}>
            Track your leave requests and their statuses.
          </p>
        </div>
        <Button onClick={() => navigate('/employee/apply-leave')}>Apply for Leave</Button>
      </div>

      <Card>
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          {['all', 'pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: filter === tab ? 'var(--primary-light)' : 'transparent',
                color: filter === tab ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab} ({leaves.filter(l => tab === 'all' || l.status === tab).length})
            </button>
          ))}
        </div>

        {filteredLeaves.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No leaves found"
            description={`You do not have any ${filter !== 'all' ? filter : ''} leave applications recorded.`}
          />
        ) : (
          <Table columns={columns} data={filteredLeaves} />
        )}
      </Card>
    </div>
  );
};

export default LeaveHistory;
