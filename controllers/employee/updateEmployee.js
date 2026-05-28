const { User } = require('../models/userSchema');
const bcrypt = require('bcrypt');

async function updateEmployee(req, res) {

    try {

        const employeeId = req.params.id;
        const { name, email, password, profileImage } = req.body;
        const employee = await User.findById(employeeId);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        if (email && email !== employee.email) {                 //check for current email and given email

            const existingEmail = await User.findOne({ email });   //check for exsting email

            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
        }

        if (name) {
            employee.name = name;
        }

        if (email) {
            employee.email = email;
        }

        if (profileImage) {
            employee.profileImage = profileImage;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            employee.password = hashedPassword;
        }

        await employee.save();

        return res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            employee: employee
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

module.exports = { updateEmployee };