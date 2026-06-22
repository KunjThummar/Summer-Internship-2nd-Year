import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DepartmentContext } from '../../context/DepartmentContext';
import { useToast } from '../../hooks/useToast';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmDialog from '../../components/ConfirmDialog';
import '../../styles/tables.css';

const DepartmentList = () => {
  const { departments, loading, error, fetchDepartments, deleteDepartment } = useContext(DepartmentContext);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await deleteDepartment(deleteId);
      toast.success('Department deleted successfully');
      setDeleteId(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete department');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    { header: 'Department Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="table-actions">
          <Button size="sm" variant="secondary" onClick={() => navigate(`/admin/departments/edit/${row._id}`)}>
            ✏ Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteId(row._id)}>
            🗑 Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="table-toolbar" style={{ justifyContent: 'flex-end' }}>
        <Button onClick={() => navigate('/admin/departments/add')}>
          🏢 Add Department
        </Button>
      </div>

      {error && (
        <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontWeight: 500 }}>
          Error: {error}
        </div>
      )}

      <Card>
        <Table columns={columns} data={departments} loading={loading} emptyMessage="No departments found" />
      </Card>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Confirm Department Deletion"
        message="Are you sure you want to delete this department? Employees assigned to this department will need to be reassigned manually."
        confirmText="Delete department"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </div>
  );
};

export default DepartmentList;
