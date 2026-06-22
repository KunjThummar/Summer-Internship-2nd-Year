import React from 'react';
import '../../styles/components.css';

const Avatar = ({ src, name = '', size = 40 }) => {
  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const parts = fullName.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className="avatar"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.4}px`,
      }}
    >
      {src ? (
        <img src={src} alt={name} onError={(e) => (e.target.style.display = 'none')} />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;
