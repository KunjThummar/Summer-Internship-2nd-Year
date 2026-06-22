import React from 'react';
import '../../styles/components.css';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner" style={{ width: '16px', height: '16px', borderLineWidth: '2px' }}></span>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
