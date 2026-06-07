
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }
}, {
    timestamps: true
});

const Department = mongoose.model('Department', departmentSchema);
module.exports = { Department };