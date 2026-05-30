const { Leave } = require('../../models/leaveSchema');
const { Employee } = require('../../models/employeeSchema');

// Fetch all leave history for a specific employee (for UI button click)
async function fetchLeave(req, res) {
    try {
        const { employeeId } = req.params;
        if (!employeeId) {
            return res.status(400).json({ success: false, message: 'Employee ID is required' });
        }
        // Optionally, verify employee exists
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        // Fetch all leave records for this employee
        const leaves = await Leave.find({ employee: employeeId }).sort({ startDate: -1 });
        return res.status(200).json({ success: true, leaves });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { fetchLeave };