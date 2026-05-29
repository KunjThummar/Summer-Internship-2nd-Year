const { Salary } = require('../../models/salarySchema');
const { User } = require('../../models/userSchema');

async function addSalary(req, res) {
    try {
        const { employeeId, baseSalary, allowances, deductions } = req.body;
        if (!employeeId || !baseSalary) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID and base salary are required'
            });
        }
        
        const employee = await User.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const netSalary = baseSalary + (allowances || 0) - (deductions || 0);
        
        const newSalary = new Salary({
            employeeId,
            baseSalary,
            allowances,
            deductions,
            netSalary
        });

        await newSalary.save();
        
        return res.status(201).json({
            success: true,
            message: 'Salary added successfully',
            salary: newSalary
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { addSalary };