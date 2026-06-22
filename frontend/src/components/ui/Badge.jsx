import React from 'react';
import '../../styles/components.css';

const Badge = ({ variant = 'pending', text, className = '' }) => {
  // Map backend statuses to CSS classes
  let badgeClass = 'pending';
  
  const v = (text || variant).toLowerCase();
  
  if (['approved', 'present', 'active'].includes(v)) {
    badgeClass = 'approved';
  } else if (['rejected', 'absent', 'inactive'].includes(v)) {
    badgeClass = 'rejected';
  } else if (['leave', 'sick', 'casual', 'earned', 'unpaid', 'other'].includes(v)) {
    badgeClass = 'leave';
  }

  return (
    <span className={`badge badge-${badgeClass} ${className}`}>
      {text || variant}
    </span>
  );
};

export default Badge;
