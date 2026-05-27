const express = require('express');
const { authMiddleware } = require('../authMiddleware')

const router = express.Router();

const { register } = require('../controllers/userRegister')

const { login } = require('../controllers/userLogin')
    
router.post('/register' , authMiddleware, register )
router.post('/login', login)

module.exports = router;