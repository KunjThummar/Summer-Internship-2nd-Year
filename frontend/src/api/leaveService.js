import api from './axios';

export const leaveService = {
  addLeave: async (leaveData) => {
    const response = await api.post('/employee/addleave', leaveData);
    return response.data; // { success, leave }
  },

  fetchLeaves: async (employeeId) => {
    const response = await api.get(`/employee/fetchleave/${employeeId}`);
    return response.data; // { success, leaves }
  },

  fetchAllLeaves: async () => {
    const response = await api.get('/employee/fetchleaves');
    return response.data; // { success, leaves }
  },

  updateLeaveStatus: async (id, status) => {
    const response = await api.put(`/employee/updateleave/${id}`, { status });
    return response.data; // { success, leave }
  },

  fetchLeaveCounts: async () => {
    const [approvedRes, pendingRes, rejectedRes] = await Promise.all([
      api.get('/employee/fetchapprovedleavescount'),
      api.get('/employee/fetchpendingleavescount'),
      api.get('/employee/fetchrejectedleavescount')
    ]);

    return {
      approved: approvedRes.data.approvedLeaveCount || approvedRes.data.success || 0,
      pending: pendingRes.data.pendingLeaveCount || pendingRes.data.success || 0,
      rejected: rejectedRes.data.rejectedLeaveCount || rejectedRes.data.success || 0
    };
  }
};
