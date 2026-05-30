const { Leave } = require('../../models/leaveSchema');
const { Employee } = require('../../models/employeeSchema');

async function addLeave(req, res) {
    try {
        const { employeeId, leaveType, startDate, endDate, reason } = req.body;
        if (!employeeId || !leaveType || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        const leave = new Leave({
            employee: employeeId,
            leaveType,
            startDate,
            endDate,
            reason
        });
        await leave.save();
        return res.status(201).json({ success: true, message: 'Leave applied successfully', leave });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { addLeave };