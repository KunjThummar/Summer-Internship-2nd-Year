const { Department } = require('../../models/departmentSchema');

async function addDepartment(req, res) {
    try {
        const { departmentName, departmentDescription } = req.body;

        if (!departmentName) {
            return res.status(400).json({ error: "Department name is required" });
        }

        const existingDepartment = await Department.findOne({ name: departmentName });
        if (existingDepartment) {
            return res.status(400).json({ error: "Department already exists" });
        }

        const newDepartment = new Department({
            name: departmentName,
            description: departmentDescription,
        });

        await newDepartment.save();

        return res.status(201).json({
            msg: "Department added successfully",
            departmentId: newDepartment._id,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { addDepartment };