import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmployeeContext } from '../../context/EmployeeContext';
import { DepartmentContext } from '../../context/DepartmentContext';
import { useToast } from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import '../../styles/forms.css';

const EditEmployee = () => {
  const { id } = useParams();
  const { fetchEmployee, updateEmployee, loading: employeeLoading } = useContext(EmployeeContext);
  const { departments, fetchDepartments } = useContext(DepartmentContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    departmentId: '',
    employeeCode: '',
    designation: '',
    dateOfJoining: '',
    contactNumber: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setPageLoading(true);
      try {
        await fetchDepartments();
        const emp = await fetchEmployee(id);
        if (emp) {
          setFormData({
            name: emp.name || '',
            email: emp.email || '',
            password: '', // Leave empty to keep existing password
            departmentId: emp.department?._id || emp.department || '',
            employeeCode: emp.employeeCode || '',
            designation: emp.designation || '',
            dateOfJoining: emp.dateOfJoining ? emp.dateOfJoining.substring(0, 10) : '',
            contactNumber: emp.contactNumber || '',
            address: emp.address || '',
          });
        }
      } catch (err) {
        toast.error('Failed to load employee details');
      } finally {
        setPageLoading(false);
      }
    };
    loadData();
  }, [id, fetchDepartments, fetchEmployee]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Email is invalid';
    }
    if (!formData.departmentId) errs.departmentId = 'Department is required';
    if (!formData.employeeCode.trim()) errs.employeeCode = 'Employee code is required';
    if (!formData.designation.trim()) errs.designation = 'Designation is required';
    if (!formData.dateOfJoining) errs.dateOfJoining = 'Date of joining is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    
    // Prepare data to send (don't send empty password)
    const updateData = { ...formData };
    if (!updateData.password) {
      delete updateData.password;
    }

    try {
      await updateEmployee(id, updateData);
      toast.success('Employee profile updated successfully');
      navigate('/admin/employees');
    } catch (err) {
      toast.error(err.message || 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <Loader message="Loading employee information..." />;
  }

  const departmentOptions = departments.map((dept) => ({
    value: dept._id,
    label: dept.name,
  }));

  return (
    <Card title="Edit Employee Profile">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          <Input
            label="Full Name"
            id="name"
            placeholder="Jane Doe"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="jane@company.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <Input
            label="Login Password (leave empty to keep unchanged)"
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Input
            label="Employee Code"
            id="employeeCode"
            placeholder="EMP-1002"
            value={formData.employeeCode}
            onChange={handleChange}
            error={errors.employeeCode}
            required
          />
          <Select
            label="Department"
            id="departmentId"
            options={departmentOptions}
            value={formData.departmentId}
            onChange={handleChange}
            error={errors.departmentId}
            required
          />
          <Input
            label="Designation"
            id="designation"
            placeholder="Senior Software Engineer"
            value={formData.designation}
            onChange={handleChange}
            error={errors.designation}
            required
          />
          <Input
            label="Date of Joining"
            id="dateOfJoining"
            type="date"
            value={formData.dateOfJoining}
            onChange={handleChange}
            error={errors.dateOfJoining}
            required
          />
          <Input
            label="Contact Number"
            id="contactNumber"
            placeholder="+1 555-0199"
            value={formData.contactNumber}
            onChange={handleChange}
            error={errors.contactNumber}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <textarea
            id="address"
            rows="3"
            className="form-input"
            placeholder="123 Main St, City, Country"
            value={formData.address}
            onChange={handleChange}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="form-actions">
          <Button variant="secondary" onClick={() => navigate('/admin/employees')} disabled={loading}>
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

export default EditEmployee;
