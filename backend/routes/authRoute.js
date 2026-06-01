const express = require('express');

//Middlewares
const { authMiddleware } = require('../middleware/authMiddleware')
const { checkAdmin } = require('../middleware/checkAdmin')

//Controllers
const router = express.Router();


const { register } = require('../controllers/userRegister')
const { login } = require('../controllers/userLogin')

//routes
router.post('/register' , register )
router.post('/login', login)

module.exports = router;