const express = require('express');

//Middlewares
const { authMiddleware } = require('../middleware/authMiddleware')
const { checkAdmin } = require('../middleware/checkAdmin')

//Controllers
const router = express.Router();


//employee routes
const { addEmployee } = require('../controllers/employee/addEmployee')
const { fetchEmployees } = require('../controllers/employee/fetchEmployees')
const { updateEmployee } = require('../controllers/employee/updateEmployee')
const { deleteEmployee } = require('../controllers/employee/deleteEmployee')
const { addSalary } = require('../controllers/employee/addSalary')
const { fetchSalaryHistory } = require('../controllers/employee/fetchSalaryHistory')

router.post('/addemployee', authMiddleware , checkAdmin, addEmployee)
router.get('/fetchemployees', authMiddleware ,fetchEmployees)
router.put('/updateemployee/:id',authMiddleware , checkAdmin,updateEmployee)
router.delete('/deleteemployee/:id',authMiddleware , checkAdmin, deleteEmployee)
router.post('/addsalary', authMiddleware , checkAdmin, addSalary)
router.get('/fetchsalaryhistory/:employeeId', authMiddleware , checkAdmin, fetchSalaryHistory)

module.exports = router;