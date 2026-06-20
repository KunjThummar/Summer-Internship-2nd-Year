const { Employee } = require('../../models/employeeSchema');

async function fetchEmployeeCount(req, res) {
    try {
        const totalEmployees = await Employee.countDocuments({ role: 'employee' });
        return res.status(200).json({ 
            msg: "Employee count fetched successfully", 
            totalEmployees 
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { fetchEmployeeCount };