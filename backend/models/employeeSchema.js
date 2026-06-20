const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    // merged user fields
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'employee'],
        default: 'employee'
    },
    isActive: {
        type: Boolean,
        default: true
    },

    // employee-specific fields
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    employeeCode: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    designation: {
        type: String,
        trim: true
    },
    dateOfJoining: {
        type: Date,
        default: Date.now
    },
    contactNumber: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'terminated', 'on_leave'],
        default: 'active'
    },
    profileImage: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

employeeSchema.index({ department: 1 });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = { Employee };