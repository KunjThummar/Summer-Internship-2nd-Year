import React from 'react';
import '../styles/index.css';

const EmptyState = ({ icon = '📁', title = 'No records found', description = 'There are no items to display in this list.' }) => {
  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        textAlign: 'center',
        gap: '0.75rem',
      }}
    >
      <span style={{ fontSize: '3rem', margin: 0 }}>{icon}</span>
      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '300px', lineHeight: 1.4 }}>
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
