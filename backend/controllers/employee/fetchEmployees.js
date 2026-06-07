const { Employee } = require('../../models/employeeSchema');

async function fetchEmployees(req, res) {
    try {
        const employees = await Employee.find()
            .populate('department', 'name');

        return res.status(200).json({
            msg: 'Employees fetched successfully',
            employees
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { fetchEmployees };