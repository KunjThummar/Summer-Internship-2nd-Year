const { Department } = require('../../models/departmentSchema')


async function fetchDepartment(req, res) {
    try {
        const departments = await Department.find();
        return res.status(200).json({ departments });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { fetchDepartment };