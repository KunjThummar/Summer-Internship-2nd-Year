const { Employee } = require('../../models/employeeSchema');
const { Department } = require('../../models/departmentSchema');
const bcrypt = require('bcrypt');

async function updateEmployee(req, res) {
    try {
        const employeeId = req.params.id;
        const {
            name,
            email,
            password,
            profileImage,
            departmentId,
            designation,
            contactNumber,
            address,
            dateOfJoining,
            status,
            employeeCode
        } = req.body;

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        if (email && email !== employee.email) {
            const existingEmail = await Employee.findOne({ email });
            if (existingEmail && existingEmail._id.toString() !== employeeId) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
            employee.email = email;
        }

        if (name) employee.name = name;
        if (password) employee.password = await bcrypt.hash(password, 10);

        if (departmentId) {
            const department = await Department.findById(departmentId);
            if (!department) {
                return res.status(404).json({
                    success: false,
                    message: 'Department not found'
                });
            }
            employee.department = departmentId;
        }

        if (designation !== undefined) employee.designation = designation;
        if (contactNumber !== undefined) employee.contactNumber = contactNumber;
        if (address !== undefined) employee.address = address;
        if (dateOfJoining !== undefined) employee.dateOfJoining = dateOfJoining;
        if (status !== undefined) employee.status = status;
        if (employeeCode !== undefined) employee.employeeCode = employeeCode;
        if (profileImage !== undefined) employee.profileImage = profileImage;

        await employee.save();

        const updatedProfile = await Employee.findById(employeeId)
            .populate('department', 'name');

        return res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            employee: updatedProfile
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { updateEmployee };