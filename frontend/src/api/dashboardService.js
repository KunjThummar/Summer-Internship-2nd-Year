import api from './axios';

export const dashboardService = {
  fetchEmployeeCount: async () => {
    const response = await api.get('/dashboard/fetchemployeecount');
    return response.data; // { msg, totalEmployees }
  },

  fetchDepartmentCount: async () => {
    const response = await api.get('/dashboard/fetchdepartmentcount');
    return response.data; // { msg, totalDepartments }
  },

  fetchTotalSalary: async () => {
    const response = await api.get('/dashboard/totalsalary');
    return response.data; // { Total_Salary }
  }
};
