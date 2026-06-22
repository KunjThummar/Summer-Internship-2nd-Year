import React from 'react';
import '../../styles/components.css';

const Loader = ({ size = 'md', fullScreen = false, message = 'Loading records...' }) => {
  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--bg-app)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <div className="spinner spinner-lg"></div>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{message}</p>
      </div>
    );
  }

  return (
    <div className="loader-container">
      <div className={`spinner ${size === 'lg' ? 'spinner-lg' : ''}`}></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{message}</p>
    </div>
  );
};

export default Loader;
