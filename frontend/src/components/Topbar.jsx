import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Avatar from './ui/Avatar';
import '../styles/layout.css';

const Topbar = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="topbar-right">
        <div className="user-info">
          <div className="user-details">
            <span className="user-name">{user?.name || 'Guest User'}</span>
            <span className="user-role">{user?.designation || user?.role || 'User'}</span>
          </div>
          <Avatar src={user?.profileImage} name={user?.name || 'Guest'} size={40} />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
