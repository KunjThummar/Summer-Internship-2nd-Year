const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router();

const { register } = require('../controllers/userRegister')

const { login } = require('../controllers/userLogin')

const {fetchDepartments} = require('../controllers/departmentFetch')
    
router.post('/register' , register )
router.post('/login', login)
router.get('/departments', fetchDepartments)

module.exports = router;