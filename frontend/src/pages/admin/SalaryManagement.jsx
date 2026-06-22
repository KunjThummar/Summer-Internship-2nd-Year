import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeContext } from '../../context/EmployeeContext';
import { SalaryContext } from '../../context/SalaryContext';
import { useToast } from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import '../../styles/forms.css';

const SalaryManagement = () => {
  const { employees, fetchEmployees } = useContext(EmployeeContext);
  const { addSalary } = useContext(SalaryContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: '',
    baseSalary: '',
    allowances: '',
    deductions: '',
    periodStart: '',
    periodEnd: '',
  });

  const [netSalary, setNetSalary] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Recalculate net salary on change
  useEffect(() => {
    const base = parseFloat(formData.baseSalary) || 0;
    const allow = parseFloat(formData.allowances) || 0;
    const deduct = parseFloat(formData.deductions) || 0;
    setNetSalary(base + allow - deduct);
  }, [formData.baseSalary, formData.allowances, formData.deductions]);

  const validate = () => {
    const errs = {};
    if (!formData.employeeId) errs.employeeId = 'Employee selection is required';
    if (!formData.baseSalary || parseFloat(formData.baseSalary) <= 0) {
      errs.baseSalary = 'Base salary must be greater than 0';
    }
    if (!formData.periodStart) errs.periodStart = 'Period start date is required';
    if (!formData.periodEnd) errs.periodEnd = 'Period end date is required';
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
    try {
      await addSalary({
        employeeId: formData.employeeId,
        baseSalary: parseFloat(formData.baseSalary),
        allowances: parseFloat(formData.allowances) || 0,
        deductions: parseFloat(formData.deductions) || 0,
        periodStart: formData.periodStart,
        periodEnd: formData.periodEnd,
      });
      toast.success('Salary record saved successfully');
      navigate(`/admin/salary/history/${formData.employeeId}`);
    } catch (err) {
      toast.error(err.message || 'Failed to submit salary details');
    } finally {
      setLoading(false);
    }
  };

  const employeeOptions = employees.map((emp) => ({
    value: emp._id,
    label: `${emp.name} (${emp.employeeCode})`,
  }));

  return (
    <Card title="Process Employee Salary">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          <Select
            label="Select Employee"
            id="employeeId"
            options={employeeOptions}
            value={formData.employeeId}
            onChange={handleChange}
            error={errors.employeeId}
            required
          />
          <Input
            label="Base Salary"
            id="baseSalary"
            type="number"
            placeholder="5000"
            value={formData.baseSalary}
            onChange={handleChange}
            error={errors.baseSalary}
            required
          />
          <Input
            label="Allowances / Bonuses"
            id="allowances"
            type="number"
            placeholder="500"
            value={formData.allowances}
            onChange={handleChange}
          />
          <Input
            label="Deductions"
            id="deductions"
            type="number"
            placeholder="200"
            value={formData.deductions}
            onChange={handleChange}
          />
          <Input
            label="Pay Period Start"
            id="periodStart"
            type="date"
            value={formData.periodStart}
            onChange={handleChange}
            error={errors.periodStart}
            required
          />
          <Input
            label="Pay Period End"
            id="periodEnd"
            type="date"
            value={formData.periodEnd}
            onChange={handleChange}
            error={errors.periodEnd}
            required
          />
        </div>

        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Calculated Net Salary:</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
            ${netSalary.toLocaleString()}
          </span>
        </div>

        <div className="form-actions">
          <Button variant="secondary" onClick={() => navigate('/admin/employees')} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Confirm & Save Salary
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SalaryManagement;
