import React, { createContext, useState, useCallback } from 'react';
import { salaryService } from '../api/salaryService';

export const SalaryContext = createContext();

export const SalaryProvider = ({ children }) => {
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSalaryHistory = useCallback(async (employeeId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await salaryService.fetchSalaryHistory(employeeId);
      setSalaryHistory(data.salaryHistory || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addSalary = async (salaryData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await salaryService.addSalary(salaryData);
      setSalaryHistory((prev) => [data.salary, ...prev]);
      return data.salary;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SalaryContext.Provider
      value={{
        salaryHistory,
        loading,
        error,
        fetchSalaryHistory,
        addSalary
      }}
    >
      {children}
    </SalaryContext.Provider>
  );
};
