const { Department } = require('../../models/departmentSchema');
const { Employee } = require('../../models/employeeSchema');

async function deleteDepartment(req, res) {
    try {
        const departmentId = req.params.id;

        // Check if employees are assigned to this department
        const employeeCount = await Employee.countDocuments({ department: departmentId });
        if (employeeCount > 0) {
            return res.status(400).json({
                msg: `Cannot delete - ${employeeCount} employees assigned to this department`
            });
        }

        const departmentDeleted = await Department.findByIdAndDelete(departmentId);
        if (!departmentDeleted) {
            return res.status(404).json({ msg: 'No department found' });
        }
        return res.status(200).json({ msg: 'Department deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
module.exports = { deleteDepartment };
