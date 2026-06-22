import React from 'react';
import '../../styles/index.css';

const Card = ({ title, children, className = '', headerAction, ...props }) => {
  return (
    <div className={`glass-panel ${className}`} style={{ padding: '1.5rem' }} {...props}>
      {(title || headerAction) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.75rem',
          }}
        >
          {title && <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{title}</h3>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;
