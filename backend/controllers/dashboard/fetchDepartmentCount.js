const { Department } = require('../../models/departmentSchema');

async function fetchDepartmentCount(req, res) {
    try {
        const totalDepartments = await Department.countDocuments();
        return res.status(200).json({ 
            msg: "Department count fetched successfully",
            totalDepartments
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { fetchDepartmentCount };