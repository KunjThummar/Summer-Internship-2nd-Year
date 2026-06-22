import React from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';

const ConfirmDialog = ({ isOpen, title = 'Are you sure?', message, onConfirm, onCancel, confirmText = 'Delete', loading = false }) => {
  const footer = (
    <>
      <Button variant="secondary" onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm} loading={loading}>
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} footer={footer}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
        {message}
      </p>
    </Modal>
  );
};

export default ConfirmDialog;
