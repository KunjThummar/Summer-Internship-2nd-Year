import React, { useState, useEffect } from 'react';
import '../../styles/components.css';

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { message, type } = e.detail;
      const id = Date.now() + Math.random();
      
      setToasts((prev) => [...prev, { id, message, type }]);

      // Self-dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener('show-toast', handleToast);
    return () => {
      window.removeEventListener('show-toast', handleToast);
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>
              {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{t.message}</span>
          </div>
          <button onClick={() => removeToast(t.id)} className="toast-close">
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
