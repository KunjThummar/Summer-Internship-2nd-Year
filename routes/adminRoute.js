const express = require('express');

//Middlewares
const { authMiddleware } = require('../middleware/authMiddleware')
const { checkAdmin } = require('../middleware/checkAdmin')

//Controllers
const router = express.Router();

//routes

const { addDepartment } = require('../controllers/department/addDepartment')
const { fetchDepartment } = require('../controllers/department/fetchDepartment')
const { updateDepartment } = require('../controllers/department/updateDepartment')
const { deleteDepartment } = require('../controllers/department/deleteDepartment')


router.get('/fetchdepartment', fetchDepartment)
router.post('/adddepartment', checkAdmin, addDepartment)
router.put('/updatedepartment/:id', checkAdmin,updateDepartment)
router.delete('/deletedepartment/:id', checkAdmin, deleteDepartment)

module.exports = router;