const { Salary } = require('../../models/salarySchema');
const { Employee } = require('../../models/employeeSchema');

async function addSalary(req, res) {
    try {
        const { employeeId, baseSalary, allowances = 0, deductions = 0, periodStart, periodEnd, notes } = req.body;
        if (!employeeId || baseSalary === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID and base salary are required'
            });
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const netSalary = baseSalary + Number(allowances) - Number(deductions);
        const newSalary = new Salary({
            employee: employee._id,
            baseSalary,
            allowances,
            deductions,
            netSalary,
            periodStart,
            periodEnd,
            notes
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