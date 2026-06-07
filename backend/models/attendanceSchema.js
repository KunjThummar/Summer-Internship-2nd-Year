const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Leave'],
        required: true
    },
    remark: {
        type: String,
        trim: true
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }
}, {
    timestamps: true
});

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = { Attendance };

