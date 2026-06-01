const { User } = require('../models/userSchema')
const bcrypt = require('bcrypt')

async function register(req, res) {
    try {
        const {
            name,
            email,
            password,
            role,
            profileImage
        } = req.body
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required" })
        }

        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            profileImage
        })

        await newUser.save()

        return res.status(201).json({
            msg: "Registration successful",
            userId: newUser._id
        })

    }

    catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


module.exports = { register }
