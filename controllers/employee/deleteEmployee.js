const { User } = require('../../models/userSchema')

async function deleteEmployee(req, res) {
    try {
        const employeeId = req.params.id;

        const employee = await User.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await employee.remove();

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { deleteEmployee };