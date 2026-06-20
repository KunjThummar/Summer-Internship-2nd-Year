const express = require('express');

//Middlewares
const { authMiddleware } = require('../middleware/authMiddleware')
const { checkAdmin } = require('../middleware/checkAdmin')

//Controllers
const router = express.Router();


//attendance routes 
const { markAttendance } = require('../controllers/attendence/markAttendence');

router.post('/markattendance', authMiddleware,checkAdmin, markAttendance);

module.exports = router;
