import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <Card title="Session Expired">
        <p style={{ color: 'var(--text-secondary)' }}>Please log in to view your profile details.</p>
      </Card>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left Card: Summary */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
          <Avatar src={user.profileImage} name={user.name} size={120} />
          <h2 style={{ marginTop: '1rem', marginBottom: '0.25rem', fontSize: '1.4rem', fontWeight: 700 }}>
            {user.name}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
            {user.designation || 'Staff Member'}
          </p>
          <Badge variant="active" text={user.status || 'Active'} />
        </Card>

        {/* Right Card: Full details */}
        <Card title="Personal Employment Details">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Employee Code
              </h4>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>{user.employeeCode || 'N/A'}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Email Address
              </h4>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>{user.email}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Department
              </h4>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>{user.department?.name || 'Unassigned'}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Date of Joining
              </h4>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>
                {user.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Contact Number
              </h4>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>{user.contactNumber || 'N/A'}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Portal Access Level
              </h4>
              <p style={{ fontSize: '1rem', fontWeight: 500, textTransform: 'capitalize' }}>{user.role}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Home Address
            </h4>
            <p style={{ fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 }}>
              {user.address || 'No residential address is currently on file.'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
