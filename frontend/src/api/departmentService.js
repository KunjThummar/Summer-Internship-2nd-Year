import api from './axios';

export const departmentService = {
  fetchDepartments: async () => {
    const response = await api.get('/department/fetchdepartment');
    return response.data; // { departments }
  },

  addDepartment: async (name, description) => {
    const response = await api.post('/department/adddepartment', {
      departmentName: name,
      departmentDescription: description
    });
    return response.data; // { msg, departmentId }
  },

  updateDepartment: async (id, name, description) => {
    const response = await api.put(`/department/updatedepartment/${id}`, {
      departmentName: name,
      departmentDescription: description
    });
    return response.data; // { msg }
  },

  deleteDepartment: async (id) => {
    const response = await api.delete(`/department/deletedepartment/${id}`);
    return response.data; // { msg }
  }
};
