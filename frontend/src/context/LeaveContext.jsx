import React, { createContext, useState, useCallback } from 'react';
import { leaveService } from '../api/leaveService';

export const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
  const [leaves, setLeaves] = useState([]);
  const [counts, setCounts] = useState({ approved: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaves = useCallback(async (employeeId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaveService.fetchLeaves(employeeId);
      setLeaves(data.leaves || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaveService.fetchAllLeaves();
      setLeaves(data.leaves || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addLeave = async (leaveData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaveService.addLeave(leaveData);
      setLeaves((prev) => [data.leave, ...prev]);
      return data.leave;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaveService.updateLeaveStatus(id, status);
      setLeaves((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: data.leave.status } : item))
      );
      // Refresh count values after state change
      fetchLeaveCounts();
      return data.leave;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveCounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const countsData = await leaveService.fetchLeaveCounts();
      setCounts(countsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <LeaveContext.Provider
      value={{
        leaves,
        counts,
        loading,
        error,
        fetchLeaves,
        fetchAllLeaves,
        addLeave,
        updateLeaveStatus,
        fetchLeaveCounts
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};
