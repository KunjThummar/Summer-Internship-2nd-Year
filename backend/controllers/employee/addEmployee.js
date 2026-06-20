const { Employee } = require('../../models/employeeSchema');
const { Department } = require('../../models/departmentSchema');
const bcrypt = require('bcrypt');

async function addEmployee(req, res) {
    try {
        const {
            name,
            email,
            password,
            departmentId,
            employeeCode,
            designation,
            dateOfJoining,
            contactNumber,
            address,
            profileImage
        } = req.body;

        if (!name || !email || !password || !departmentId) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, password and department are required'
            });
        }

        const existingUser = await Employee.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployee = new Employee({
            name,
            email,
            password: hashedPassword,
            role: 'employee',
            department: department._id,
            employeeCode,
            designation,
            dateOfJoining,
            contactNumber,
            address,
            profileImage
        });

        await newEmployee.save();

        const employeeProfile = await Employee.findById(newEmployee._id)
            .populate('department', 'name');

        return res.status(201).json({
            success: true,
            message: 'Employee added successfully',
            employee: employeeProfile
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { addEmployee };