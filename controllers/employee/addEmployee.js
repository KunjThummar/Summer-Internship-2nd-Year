const { User } = require('../../models/userSchema');
const bcrypt = require('bcrypt');

async function addEmployee(req, res) {

    try {

        const {
            name,
            email,
            password,
            role,
            profileImage
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        const existingEmployee = await User.findOne({ email });

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployee = new User({
            name,
            email,
            password: hashedPassword,
            role,
            profileImage
        });

        await newEmployee.save();

        return res.status(201).json({
            success: true,
            message: 'Employee added successfully',
            employee: newEmployee
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

module.exports = { addEmployee };