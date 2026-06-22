import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { SalaryContext } from '../../context/SalaryContext';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

const SalaryView = () => {
  const { user } = useContext(AuthContext);
  const { salaryHistory, fetchSalaryHistory, loading } = useContext(SalaryContext);
  const [selectedSalary, setSelectedSalary] = useState(null);

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchSalaryHistory(user._id || user.id);
    }
  }, [user, fetchSalaryHistory]);

  if (loading && salaryHistory.length === 0) {
    return <Loader message="Loading salary history..." />;
  }

  const columns = [
    {
      header: 'Pay Date',
      render: (row) => new Date(row.payDate).toLocaleDateString(),
    },
    {
      header: 'Pay Period',
      render: (row) => `${new Date(row.periodStart).toLocaleDateString()} - ${new Date(row.periodEnd).toLocaleDateString()}`,
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
      header: 'Net Paid',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--success)' }}>
          ${row.netSalary.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <Button size="sm" onClick={() => setSelectedSalary(row)}>
          📄 View Pay Slip
        </Button>
      ),
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>My Salary Slips</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', fontSize: '0.95rem' }}>
          Access and view your historical payroll disbursements and detailed slips.
        </p>
      </div>

      <Card>
        {salaryHistory.length === 0 ? (
          <EmptyState
            icon="💰"
            title="No Salary Slips Found"
            description="There are no recorded salary payouts for your account at this time."
          />
        ) : (
          <Table columns={columns} data={salaryHistory} />
        )}
      </Card>

      {/* Pay Slip Modal Detail */}
      {selectedSalary && (
        <Modal
          isOpen={!!selectedSalary}
          onClose={() => setSelectedSalary(null)}
          title="Earnings Statement / Pay Slip"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <Button onClick={() => setSelectedSalary(null)}>Close Statement</Button>
            </div>
          }
        >
          <div style={{ padding: '0.5rem', color: 'var(--text-primary)' }}>
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: 700, color: 'var(--primary)' }}>ERP ENTERPRISE</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>Payroll Department</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: 600 }}>Statement Date</p>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>
                  {new Date(selectedSalary.payDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Employee details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Employee Name</span>
                <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600 }}>{user?.name}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Employee ID / Code</span>
                <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600 }}>{user?.employeeCode || 'N/A'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Department</span>
                <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600 }}>{user?.department?.name || 'Unassigned'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Pay Period</span>
                <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600, fontSize: '0.9rem' }}>
                  {new Date(selectedSalary.periodStart).toLocaleDateString()} - {new Date(selectedSalary.periodEnd).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Earnings and deductions table */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.75rem 0', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--success)' }}>Earnings</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Base Salary</span>
                  <span style={{ fontWeight: 600 }}>${selectedSalary.baseSalary.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Allowances</span>
                  <span style={{ fontWeight: 600 }}>${selectedSalary.allowances.toLocaleString()}</span>
                </div>
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.75rem 0', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--danger)' }}>Deductions</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Deductions</span>
                  <span style={{ fontWeight: 600 }}>-${selectedSalary.deductions.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Summary calculation */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
              <div style={{ textAlign: 'right', width: '250px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Gross Pay:</span>
                  <span style={{ fontWeight: 600 }}>${(selectedSalary.baseSalary + selectedSalary.allowances).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Deductions Total:</span>
                  <span style={{ fontWeight: 600 }}>-${selectedSalary.deductions.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem', fontSize: '1.15rem' }}>
                  <span style={{ fontWeight: 700 }}>Net Take Home:</span>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>
                    ${selectedSalary.netSalary.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SalaryView;
