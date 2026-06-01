const express = require('express');

//Middlewares
const { authMiddleware } = require('../middleware/authMiddleware')
const { checkAdmin } = require('../middleware/checkAdmin')

//Controllers
const router = express.Router();


//employee routes

const { addEmployee } = require('../controllers/employee/addEmployee');
const { fetchEmployees } = require('../controllers/employee/fetchEmployees');
const { updateEmployee } = require('../controllers/employee/updateEmployee');
const { deleteEmployee } = require('../controllers/employee/deleteEmployee');
const { addSalary } = require('../controllers/employee/addSalary');
const { fetchSalaryHistory } = require('../controllers/employee/fetchSalaryHistory');
const { addLeave } = require('../controllers/employee/addLeave');
const { fetchLeave } = require('../controllers/employee/fetchLeave');
const { fetchApprovedLeaveCount } = require('../controllers/dashboard/fetchApprovedLeaveCount');
const { fetchPendingLeaveCount } = require('../controllers/dashboard/fetchPendingLeaveCount');
const { fetchRejectedLeaveCount } = require('../controllers/dashboard/fetchRejectedLeaveCount');


router.post('/addemployee', authMiddleware, checkAdmin, addEmployee);
router.get('/fetchemployees', authMiddleware, fetchEmployees);
router.put('/updateemployee/:id', authMiddleware, checkAdmin, updateEmployee);
router.delete('/deleteemployee/:id', authMiddleware, checkAdmin, deleteEmployee);
router.post('/addsalary', authMiddleware, checkAdmin, addSalary);
router.get('/fetchsalaryhistory/:employeeId', authMiddleware, checkAdmin, fetchSalaryHistory);


// Leave routes

router.post('/addleave', authMiddleware, addLeave);

// Fetch all leave history for a specific employee 
router.get('/fetchleave/:employeeId', authMiddleware, fetchLeave);

// Leave count routes
router.get('/fetchapprovedleavescount', authMiddleware, fetchApprovedLeaveCount);
router.get('/fetchpendingleavescount', authMiddleware, fetchPendingLeaveCount);
router.get('/fetchrejectedleavescount', authMiddleware, fetchRejectedLeaveCount);

module.exports = router;
