import React, { useContext, useEffect, useState } from 'react';
import { LeaveContext } from '../../context/LeaveContext';
import { useToast } from '../../hooks/useToast';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';

const LeaveManagement = () => {
  const { leaves, loading, fetchAllLeaves, updateLeaveStatus } = useContext(LeaveContext);
  const [activeTab, setActiveTab] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchAllLeaves();
  }, [fetchAllLeaves]);

  const handleStatusUpdate = async (id, status) => {
    setActionLoadingId(id);
    try {
      await updateLeaveStatus(id, status);
      toast.success(`Leave request ${status} successfully`);
    } catch (err) {
      toast.error(err.message || 'Failed to update leave status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    if (activeTab === 'all') return true;
    return leave.status === activeTab;
  });

  const columns = [
    {
      header: 'Employee',
      render: (row) => row.employee?.name || 'Unknown',
    },
    { header: 'Type', accessor: 'leaveType' },
    {
      header: 'Dates',
      render: (row) => (
        <span style={{ fontSize: '0.85rem' }}>
          {new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}
        </span>
      ),
    },
    { header: 'Reason', accessor: 'reason' },
    {
      header: 'Status',
      render: (row) => <Badge variant={row.status} />,
    },
    {
      header: 'Action',
      render: (row) => {
        if (row.status === 'pending') {
          return (
            <div className="table-actions">
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleStatusUpdate(row._id, 'approved')}
                loading={actionLoadingId === row._id}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleStatusUpdate(row._id, 'rejected')}
                loading={actionLoadingId === row._id}
              >
                Reject
              </Button>
            </div>
          );
        }
        return <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Reviewed</span>;
      },
    },
  ];

  const tabs = [
    { id: 'all', label: 'All Requests' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              border: 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && leaves.length === 0 ? (
        <Loader message="Loading leave applications..." />
      ) : (
        <Card>
          <Table columns={columns} data={filteredLeaves} emptyMessage="No leave records match this filter" />
        </Card>
      )}
    </div>
  );
};

export default LeaveManagement;
