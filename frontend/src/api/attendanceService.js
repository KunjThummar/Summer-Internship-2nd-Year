import api from './axios';

export const attendanceService = {
  markAttendance: async (attendanceRecords) => {
    const response = await api.post('/attendance/markattendance', {
      attendanceData: attendanceRecords
    });
    return response.data; // { success, message }
  },

  fetchAttendance: async (employeeId) => {
    const response = await api.get(`/attendance/fetchattendance/${employeeId}`);
    return response.data; // { success, records }
  }
};
