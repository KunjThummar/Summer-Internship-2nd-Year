import api from './axios';

export const salaryService = {
  addSalary: async (salaryData) => {
    const response = await api.post('/employee/addsalary', salaryData);
    return response.data; // { success, salary }
  },

  fetchSalaryHistory: async (employeeId) => {
    const response = await api.get(`/employee/fetchsalaryhistory/${employeeId}`);
    return response.data; // { success, salaryHistory }
  }
};
