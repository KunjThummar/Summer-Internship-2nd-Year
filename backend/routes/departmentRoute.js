const express = require('express');

//Middlewares
const { authMiddleware } = require('../middleware/authMiddleware')
const { checkAdmin } = require('../middleware/checkAdmin')

//Controllers
const router = express.Router();

//routes

//department routes
const { addDepartment } = require('../controllers/department/addDepartment')
const { fetchDepartment } = require('../controllers/department/fetchDepartment')
const { updateDepartment } = require('../controllers/department/updateDepartment')
const { deleteDepartment } = require('../controllers/department/deleteDepartment')

router.get('/fetchdepartment', authMiddleware ,fetchDepartment)
router.post('/adddepartment', authMiddleware , checkAdmin, addDepartment)
router.put('/updatedepartment/:id',authMiddleware , checkAdmin,updateDepartment)
router.delete('/deletedepartment/:id',authMiddleware , checkAdmin, deleteDepartment)

module.exports = router;