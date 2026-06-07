const { Employee } = require('../models/employeeSchema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


function issueAuthToken(user) {
    return jwt.sign(
        {
            id: user._id,
            userEmail: user.email,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: '1d' }

    )
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await Employee.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ error: "Email or password is incorrect" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Email or password is incorrect" });
        }

        const jwtToken = issueAuthToken(user);

        return res.status(200).json({
            msg: "Login succesful",
            userId: user._id,
            jwt: jwtToken
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {login}


