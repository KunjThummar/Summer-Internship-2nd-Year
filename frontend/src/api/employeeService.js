import api from './axios';

export const employeeService = {
  fetchEmployees: async () => {
    const response = await api.get('/employee/fetchemployees');
    return response.data; // { msg, employees }
  },

  fetchEmployee: async (id) => {
    const response = await api.get(`/employee/fetchemployee/${id}`);
    return response.data; // { success, employee }
  },

  addEmployee: async (employeeData) => {
    const response = await api.post('/employee/addemployee', employeeData);
    return response.data; // { success, message, employee }
  },

  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/employee/updateemployee/${id}`, employeeData);
    return response.data; // { success, employee }
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/employee/deleteemployee/${id}`);
    return response.data; // { message }
  }
};
