import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LeaveContext } from '../../context/LeaveContext';
import { useToast } from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import '../../styles/forms.css';

const ApplyLeave = () => {
  const { user } = useContext(AuthContext);
  const { addLeave } = useContext(LeaveContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.leaveType) errs.leaveType = 'Leave type is required';
    if (!formData.startDate) errs.startDate = 'Start date is required';
    if (!formData.endDate) errs.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      errs.endDate = 'End date must be after start date';
    }
    if (!formData.reason.trim()) errs.reason = 'Reason for leave is required';
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
      await addLeave({
        employeeId: user._id || user.id,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      });
      toast.success('Leave application submitted successfully');
      navigate('/employee/leave-history');
    } catch (err) {
      toast.error(err.message || 'Failed to submit leave application');
    } finally {
      setLoading(false);
    }
  };

  const leaveOptions = [
    { value: 'sick', label: 'Sick Leave' },
    { value: 'casual', label: 'Casual Leave' },
    { value: 'earned', label: 'Earned Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' },
    { value: 'other', label: 'Other Leave' },
  ];

  return (
    <Card title="Apply for Leave of Absence">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          <Select
            label="Leave Type"
            id="leaveType"
            options={leaveOptions}
            value={formData.leaveType}
            onChange={handleChange}
            error={errors.leaveType}
            required
          />
          <Input
            label="Start Date"
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            error={errors.startDate}
            required
          />
          <Input
            label="End Date"
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            error={errors.endDate}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reason">
            Reason for Leave
          </label>
          <textarea
            id="reason"
            rows="4"
            className="form-input"
            placeholder="Explain why you are requesting leave..."
            value={formData.reason}
            onChange={handleChange}
            error={errors.reason}
            style={{ resize: 'vertical' }}
            required
          />
          {errors.reason && <span className="form-error-msg">{errors.reason}</span>}
        </div>

        <div className="form-actions">
          <Button variant="secondary" onClick={() => navigate('/employee/dashboard')} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Submit Application
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ApplyLeave;
