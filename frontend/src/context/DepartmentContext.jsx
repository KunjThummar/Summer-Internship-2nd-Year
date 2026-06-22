import React, { createContext, useState, useCallback } from 'react';
import { departmentService } from '../api/departmentService';

export const DepartmentContext = createContext();

export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentService.fetchDepartments();
      setDepartments(data.departments || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDepartment = async (name, description) => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentService.addDepartment(name, description);
      const newDept = { _id: data.departmentId, name, description };
      setDepartments((prev) => [...prev, newDept]);
      return newDept;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (id, name, description) => {
    setLoading(true);
    setError(null);
    try {
      await departmentService.updateDepartment(id, name, description);
      setDepartments((prev) =>
        prev.map((dept) =>
          dept._id === id ? { ...dept, name, description } : dept
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await departmentService.deleteDepartment(id);
      setDepartments((prev) => prev.filter((dept) => dept._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentContext.Provider
      value={{
        departments,
        loading,
        error,
        fetchDepartments,
        addDepartment,
        updateDepartment,
        deleteDepartment
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};
