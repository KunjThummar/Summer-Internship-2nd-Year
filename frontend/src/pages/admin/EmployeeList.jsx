import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeContext } from '../../context/EmployeeContext';
import { useToast } from '../../hooks/useToast';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import ConfirmDialog from '../../components/ConfirmDialog';
import '../../styles/tables.css';

const EmployeeList = () => {
  const { employees, loading, error, fetchEmployees, deleteEmployee } = useContext(EmployeeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await deleteEmployee(deleteId);
      toast.success('Employee record deleted successfully');
      setDeleteId(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete employee');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: 'Code', accessor: 'employeeCode' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Department',
      render: (row) => row.department?.name || 'Unassigned',
    },
    { header: 'Designation', accessor: 'designation' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="table-actions">
          <Button size="sm" variant="secondary" onClick={() => navigate(`/admin/employees/${row._id}`)}>
            👁 View
          </Button>
          <Button size="sm" variant="secondary" onClick={() => navigate(`/admin/employees/edit/${row._id}`)}>
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
      <div className="table-toolbar">
        <Input
          type="text"
          placeholder="Search name, code, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '300px', marginBottom: 0 }}
        />
        <Button onClick={() => navigate('/admin/employees/add')}>
          ➕ Add Employee
        </Button>
      </div>

      {error && (
        <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontWeight: 500 }}>
          Error: {error}
        </div>
      )}

      <Card>
        <Table columns={columns} data={filteredEmployees} loading={loading} emptyMessage="No employees found" />
      </Card>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Confirm Employee Deletion"
        message="Are you sure you want to permanently delete this employee? This will remove all their records including attendance, leave history, and salary details."
        confirmText="Delete permanently"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </div>
  );
};

export default EmployeeList;
