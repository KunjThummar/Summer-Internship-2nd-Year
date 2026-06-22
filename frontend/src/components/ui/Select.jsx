import React from 'react';
import '../../styles/forms.css';

const Select = ({
  label,
  id,
  options = [],
  value,
  onChange,
  error,
  required = false,
  placeholder = 'Select an option',
  className = '',
  ...props
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`form-select ${error ? 'error' : ''}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );
};

export default Select;
