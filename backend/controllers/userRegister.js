const { Employee } = require('../models/employeeSchema')
const bcrypt = require('bcrypt')

async function register(req, res) {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required" })
        }

        const existingUser = await Employee.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newEmployee = new Employee({
            name,
            email,
            password: hashedPassword,
            role
        })

        await newEmployee.save()

        return res.status(201).json({
            msg: "Registration successful",
            userId: newEmployee._id
        })

    }

    catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


module.exports = { register }
