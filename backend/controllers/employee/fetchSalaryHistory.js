const { Salary } = require('../../models/salarySchema');
const { Employee } = require('../../models/employeeSchema');

async function fetchSalaryHistory(req, res) {
    try {
        const employeeId = req.params.employeeId;
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const salaryHistory = await Salary.find({ employee: employee._id })
            .sort({ payDate: -1 })
            .populate('employee', 'employeeCode designation');

        return res.status(200).json({
            success: true,
            message: 'Salary history fetched successfully',
            salaryHistory
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { fetchSalaryHistory };