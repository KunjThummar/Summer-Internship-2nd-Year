const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    baseSalary: {
        type: Number,
        required: true,
        min: 0
    },
    allowances: {
        type: Number,
        default: 0,
        min: 0
    },
    deductions: {
        type: Number,
        default: 0,
        min: 0
    },
    netSalary: {
        type: Number,
        required: true,
        min: 0
    },
    payDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    periodStart: {
        type: Date
    },
    periodEnd: {
        type: Date
    },
}, {
    timestamps: true
});

salarySchema.index({ employee: 1, payDate: -1 });

const Salary = mongoose.model('Salary', salarySchema);
module.exports = { Salary };
