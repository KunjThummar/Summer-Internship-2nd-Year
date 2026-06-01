const { Salary } = require('../../models/salarySchema');
const { User } = require('../../models/userSchema');

async function fetchSalaryHistory(req, res) {
    try {
        const employeeId = req.params.employeeId;
        const employee = await User.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }
        const salaryHistory = await Salary.find({ employeeId }).sort({ payDate: -1 });
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