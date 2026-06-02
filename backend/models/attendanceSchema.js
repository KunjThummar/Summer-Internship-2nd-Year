const mongoose = require('mongoose');

const attendenceSchema = new mongoose.Schema({
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
}, {
    timestamps: true
});

attendenceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendence = mongoose.model('Attendence', attendenceSchema);

module.exports = { Attendence };

