import React, { createContext, useState, useCallback } from 'react';
import { employeeService } from '../api/employeeService';

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.fetchEmployees();
      setEmployees(data.employees || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployee = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.fetchEmployee(id);
      setSelectedEmployee(data.employee);
      return data.employee;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addEmployee = async (employeeData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.addEmployee(employeeData);
      setEmployees((prev) => [...prev, data.employee]);
      return data.employee;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id, employeeData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.updateEmployee(id, employeeData);
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === id ? data.employee : emp))
      );
      if (selectedEmployee?._id === id) {
        setSelectedEmployee(data.employee);
      }
      return data.employee;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await employeeService.deleteEmployee(id);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      if (selectedEmployee?._id === id) {
        setSelectedEmployee(null);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        selectedEmployee,
        loading,
        error,
        fetchEmployees,
        fetchEmployee,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        setSelectedEmployee
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
