const { Attendance } = require('../../models/attendanceSchema');

async function markAttendance(req, res) {
    try {
        const { attendanceData } = req.body;
        if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'attendanceData must be a non-empty array'
            });
        }

        const records = attendanceData.map(item => ({
            employee: item.employeeId,
            status: item.status,
            date: item.date ? new Date(item.date) : new Date(),
            remark: item.remark,
            recordedBy: req.user ? req.user.id : undefined
        }));

        await Attendance.insertMany(records, { ordered: false });

        return res.status(201).json({
            success: true,
            message: 'Attendance marked successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { markAttendance };