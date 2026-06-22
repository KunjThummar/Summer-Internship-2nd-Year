import React from 'react';
import '../styles/dashboard.css';

const StatCard = ({ icon, label, value, trend, trendDirection = 'up' }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-details">
        <span className="stat-card-title">{label}</span>
        <span className="stat-card-value">{value}</span>
        {trend && (
          <span className={`stat-card-trend ${trendDirection}`}>
            {trendDirection === 'up' ? '▲' : '▼'} {trend}
          </span>
        )}
      </div>
      <div className="stat-card-icon-wrapper">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
