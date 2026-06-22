import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SalaryContext } from '../../context/SalaryContext';
import { EmployeeContext } from '../../context/EmployeeContext';
import { useToast } from '../../hooks/useToast';
import Table from '../../components/ui/Table';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

const SalaryHistory = () => {
  const { employeeId } = useParams();
  const { salaryHistory, loading, fetchSalaryHistory } = useContext(SalaryContext);
  const { fetchEmployee } = useContext(EmployeeContext);
  const [employee, setEmployee] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setPageLoading(true);
      try {
        const emp = await fetchEmployee(employeeId);
        setEmployee(emp);
        await fetchSalaryHistory(employeeId);
      } catch (err) {
        toast.error('Failed to load salary ledger information');
      } finally {
        setPageLoading(false);
      }
    };
    loadData();
  }, [employeeId, fetchEmployee, fetchSalaryHistory]);

  if (pageLoading) {
    return <Loader message="Retrieving salary statements..." />;
  }

  const columns = [
    {
      header: 'Pay Date',
      render: (row) => new Date(row.createdAt || row.payDate || Date.now()).toLocaleDateString(),
    },
    {
      header: 'Pay Period',
      render: (row) => (
        <span style={{ fontSize: '0.85rem' }}>
          {new Date(row.periodStart).toLocaleDateString()} - {new Date(row.periodEnd).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Base Salary',
      render: (row) => `$${row.baseSalary.toLocaleString()}`,
    },
    {
      header: 'Allowances',
      render: (row) => `$${row.allowances.toLocaleString()}`,
    },
    {
      header: 'Deductions',
      render: (row) => `$${row.deductions.toLocaleString()}`,
    },
    {
      header: 'Net Salary Paid',
      render: (row) => (
        <span style={{ color: 'var(--success)', fontWeight: 600 }}>
          ${row.netSalary.toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="table-toolbar">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
            Pay slips for {employee?.name || 'Employee'}
          </h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            ID Code: {employee?.employeeCode || 'N/A'} | Role: {employee?.designation || 'Staff'}
          </span>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/employees')}>
          &larr; Back to Directory
        </Button>
      </div>

      <Card style={{ marginTop: '1rem' }}>
        <Table columns={columns} data={salaryHistory} emptyMessage="No salary transactions found for this employee." />
      </Card>
    </div>
  );
};

export default SalaryHistory;
