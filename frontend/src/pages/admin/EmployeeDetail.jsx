import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EmployeeContext } from '../../context/EmployeeContext';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';

const EmployeeDetail = () => {
  const { id } = useParams();
  const { fetchEmployee } = useContext(EmployeeContext);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const emp = await fetchEmployee(id);
        setEmployee(emp);
      } catch (err) {
        toast.error('Failed to load employee profile');
      } finally {
        setLoading(false);
      }
    };
    loadEmployee();
  }, [id, fetchEmployee]);

  if (loading) {
    return <Loader message="Retrieving profile details..." />;
  }

  if (!employee) {
    return (
      <Card title="Profile Not Found">
        <p style={{ color: 'var(--text-secondary)' }}>
          The requested employee record could not be found or has been deleted.
        </p>
        <Button onClick={() => navigate('/admin/employees')}>Back to Directory</Button>
      </Card>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left Side: Avatar and Quick Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
            <Avatar src={employee.profileImage} name={employee.name} size={120} />
            <h2 style={{ marginTop: '1rem', marginBottom: '0.25rem', fontSize: '1.4rem', fontWeight: 700 }}>
              {employee.name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              {employee.designation}
            </p>
            <Badge variant="active" text={employee.status || 'Active'} />
            
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '0.5rem', marginTop: '2rem' }}>
              <Button onClick={() => navigate(`/admin/employees/edit/${employee._id}`)}>
                ✏ Edit Profile
              </Button>
              <Button variant="secondary" onClick={() => navigate(`/admin/salary/history/${employee._id}`)}>
                💰 View Salary History
              </Button>
              <Button variant="secondary" onClick={() => navigate('/admin/employees')}>
                &larr; Back to Directory
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Side: Detailed Profile Form Fields */}
        <Card title="Employment Details">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Employee Code
              </h4>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>{employee.employeeCode || 'N/A'}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Email address
              </h4>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>{employee.email}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Department
              </h4>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>{employee.department?.name || 'Unassigned'}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Date of Joining
              </h4>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>
                {employee.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Contact Number
              </h4>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>{employee.contactNumber || 'N/A'}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Employee Role
              </h4>
              <p style={{ fontSize: '1rem', fontWeight: 500, textTransform: 'capitalize' }}>{employee.role}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Residential Address
            </h4>
            <p style={{ fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 }}>
              {employee.address || 'No address provided'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDetail;
