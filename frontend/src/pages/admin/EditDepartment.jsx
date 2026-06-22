import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DepartmentContext } from '../../context/DepartmentContext';
import { useToast } from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import '../../styles/forms.css';

const EditDepartment = () => {
  const { id } = useParams();
  const { departments, fetchDepartments, updateDepartment } = useContext(DepartmentContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDept = async () => {
      setPageLoading(true);
      await fetchDepartments();
      setPageLoading(false);
    };
    loadDept();
  }, [fetchDepartments]);

  useEffect(() => {
    if (departments.length > 0) {
      const dept = departments.find((d) => d._id === id);
      if (dept) {
        setName(dept.name || '');
        setDescription(dept.description || '');
      }
    }
  }, [departments, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Department name is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await updateDepartment(id, name, description);
      toast.success('Department updated successfully');
      navigate('/admin/departments');
    } catch (err) {
      toast.error(err.message || 'Failed to update department');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <Loader message="Fetching department record..." />;
  }

  return (
    <Card title="Edit Department Details">
      <form onSubmit={handleSubmit} className="form-container">
        <Input
          label="Department Name"
          id="name"
          placeholder="Human Resources"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          error={error}
          required
        />

        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows="4"
            className="form-input"
            placeholder="Focuses on employee relations, hiring, payroll, and benefits."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="form-actions">
          <Button variant="secondary" onClick={() => navigate('/admin/departments')} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EditDepartment;
