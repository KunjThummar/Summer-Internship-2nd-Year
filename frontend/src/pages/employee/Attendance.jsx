import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AttendanceContext } from '../../context/AttendanceContext';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';

const Attendance = () => {
  const { user } = useContext(AuthContext);
  const { attendanceRecords, loading, fetchAttendance } = useContext(AttendanceContext);

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchAttendance(user._id || user.id);
    }
  }, [user, fetchAttendance]);

  if (loading && attendanceRecords.length === 0) {
    return <Loader message="Retrieving your attendance sheets..." />;
  }

  const columns = [
    {
      header: 'Date',
      render: (row) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: 'Status',
      render: (row) => <Badge variant={row.status} />,
    },
    {
      header: 'Notes / Remarks',
      accessor: 'remark',
      render: (row) => row.remark || <span style={{ color: 'var(--text-muted)' }}>—</span>,
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <Card title="My Attendance Records">
        <Table columns={columns} data={attendanceRecords} emptyMessage="No attendance records have been registered for you." />
      </Card>
    </div>
  );
};

export default Attendance;
