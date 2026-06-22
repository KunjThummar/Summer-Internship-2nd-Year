import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DepartmentContext } from '../../context/DepartmentContext';
import { useToast } from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import '../../styles/forms.css';

const AddDepartment = () => {
  const { addDepartment } = useContext(DepartmentContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Department name is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await addDepartment(name, description);
      toast.success('Department created successfully');
      navigate('/admin/departments');
    } catch (err) {
      toast.error(err.message || 'Failed to create department');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Add New Department">
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
            Create Department
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddDepartment;
