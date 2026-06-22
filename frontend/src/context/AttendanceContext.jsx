import React, { createContext, useState, useCallback } from 'react';
import { attendanceService } from '../api/attendanceService';

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAttendance = useCallback(async (employeeId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.fetchAttendance(employeeId);
      setAttendanceRecords(data.records || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAttendance = async (attendanceRecordsData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.markAttendance(attendanceRecordsData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendanceRecords,
        loading,
        error,
        fetchAttendance,
        markAttendance
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
