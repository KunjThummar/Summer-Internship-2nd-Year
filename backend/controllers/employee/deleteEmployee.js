const { Employee } = require('../../models/employeeSchema');
const { Salary } = require('../../models/salarySchema');
const { Leave } = require('../../models/leaveSchema');
const { Attendance } = require('../../models/attendanceSchema');

async function deleteEmployee(req, res) {
    try {
        const employeeId = req.params.id;
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await Promise.all([
            Salary.deleteMany({ employee: employee._id }),
            Leave.deleteMany({ employee: employee._id }),
            Attendance.deleteMany({ employee: employee._id }),
            employee.deleteOne()
        ]);

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { deleteEmployee };