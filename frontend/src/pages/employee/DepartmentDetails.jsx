import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { EmployeeContext } from '../../context/EmployeeContext';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/EmptyState';
import Avatar from '../../components/ui/Avatar';

const DepartmentDetails = () => {
  const { user } = useContext(AuthContext);
  const { employees, fetchEmployees, loading } = useContext(EmployeeContext);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const userDept = user?.department;

  if (loading && employees.length === 0) {
    return <Loader message="Loading department records..." />;
  }

  if (!userDept) {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>My Department</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', fontSize: '0.95rem' }}>
            View your department details and colleagues.
          </p>
        </div>
        <EmptyState
          icon="🏢"
          title="No Department Assigned"
          description="You are not currently assigned to any department. Please contact Administration."
        />
      </div>
    );
  }

  // Filter colleagues who belong to the same department
  const userDeptId = userDept._id || userDept;
  const colleagues = employees.filter((emp) => {
    const empDeptId = emp.department?._id || emp.department;
    const isSameDept = empDeptId === userDeptId;
    const isNotSelf = emp._id !== (user._id || user.id);
    return isSameDept && isNotSelf;
  });

  const columns = [
    {
      header: 'Member',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Avatar src={row.profileImage} name={row.name} size={36} />
          <div>
            <div style={{ fontWeight: 600 }}>{row.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{row.employeeCode}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Designation',
      accessor: 'designation',
      render: (row) => <span style={{ fontWeight: 500 }}>{row.designation || 'Staff'}</span>,
    },
    {
      header: 'Email Address',
      accessor: 'email',
    },
    {
      header: 'Contact Number',
      render: (row) => row.contactNumber || 'N/A',
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>My Department</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', fontSize: '0.95rem' }}>
          Overview of your team structure and department specifications.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Department Overview */}
        <Card title="Department Info">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Department Name</span>
              <h3 style={{ margin: '0.25rem 0 0 0', fontWeight: 700, color: 'var(--primary)', fontSize: '1.35rem' }}>
                {userDept.name}
              </h3>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Description</span>
              <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                {userDept.description || 'No department overview description is available.'}
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Department Members:</span>
                <span style={{ fontWeight: 600 }}>{colleagues.length + 1}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Colleagues/Team Members */}
        <Card title="Our Team / Colleagues">
          {colleagues.length === 0 ? (
            <EmptyState
              icon="👥"
              title="No Colleagues Registered"
              description="There are no other employees currently registered in your department."
            />
          ) : (
            <Table columns={columns} data={colleagues} />
          )}
        </Card>
      </div>
    </div>
  );
};

export default DepartmentDetails;
