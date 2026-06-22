import React, { useContext, useEffect, useState } from 'react';
import { EmployeeContext } from '../../context/EmployeeContext';
import { AttendanceContext } from '../../context/AttendanceContext';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import '../../styles/tables.css';
import '../../styles/forms.css';

const AttendanceManagement = () => {
  const { employees, fetchEmployees, loading: employeesLoading } = useContext(EmployeeContext);
  const { markAttendance } = useContext(AttendanceContext);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [attendanceMap, setAttendanceMap] = useState({});
  const [remarksMap, setRemarksMap] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Set default attendance state on loading employees
  useEffect(() => {
    if (employees.length > 0) {
      const defaultAtt = {};
      const defaultRem = {};
      employees.forEach((emp) => {
        defaultAtt[emp._id] = 'Present'; // Default status
        defaultRem[emp._id] = '';
      });
      setAttendanceMap(defaultAtt);
      setRemarksMap(defaultRem);
    }
  }, [employees]);

  const handleStatusChange = (employeeId, status) => {
    setAttendanceMap((prev) => ({ ...prev, [employeeId]: status }));
  };

  const handleRemarkChange = (employeeId, remark) => {
    setRemarksMap((prev) => ({ ...prev, [employeeId]: remark }));
  };

  const handleSelectAllPresent = () => {
    const allPresent = {};
    employees.forEach((emp) => {
      allPresent[emp._id] = 'Present';
    });
    setAttendanceMap(allPresent);
    toast.info('Marked all employees as Present');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (employees.length === 0) return;

    setSubmitting(true);
    try {
      const records = employees.map((emp) => ({
        employeeId: emp._id,
        status: attendanceMap[emp._id] || 'Present',
        date: selectedDate,
        remark: remarksMap[emp._id] || '',
      }));

      await markAttendance(records);
      toast.success('Attendance records submitted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to record attendance');
    } finally {
      setSubmitting(false);
    }
  };

  if (employeesLoading && employees.length === 0) {
    return <Loader message="Retrieving employee list..." />;
  }

  return (
    <Card title="Mark Employee Attendance">
      <form onSubmit={handleSubmit} className="form-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ width: '220px' }}>
            <Input
              label="Selected Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              style={{ marginBottom: 0 }}
            />
          </div>
          <Button variant="secondary" onClick={handleSelectAllPresent} type="button">
            ✓ Set All to Present
          </Button>
        </div>

        <div className="table-container" style={{ marginTop: '1rem' }}>
          <table className="table-responsive">
            <thead>
              <tr>
                <th>Code</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.employeeCode || 'N/A'}</td>
                  <td style={{ fontWeight: 500 }}>{emp.name}</td>
                  <td>{emp.department?.name || 'Unassigned'}</td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '0.4rem 0.8rem', width: '130px', fontSize: '0.85rem' }}
                      value={attendanceMap[emp._id] || 'Present'}
                      onChange={(e) => handleStatusChange(emp._id, e.target.value)}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Leave">Leave</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      placeholder="Optional notes"
                      value={remarksMap[emp._id] || ''}
                      onChange={(e) => handleRemarkChange(emp._id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="form-actions" style={{ marginTop: '1.5rem' }}>
          <Button type="submit" variant="primary" loading={submitting}>
            Submit Attendance Ledger
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AttendanceManagement;
