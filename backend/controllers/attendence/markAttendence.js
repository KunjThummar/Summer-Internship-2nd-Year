const { Attendance } = require('../../models/attendanceSchema');

async function markAttendance(req, res) {

    try {

        const { attendanceData } = req.body;

        const today = new Date();

        const records = attendanceData.map(item => ({
            employee: item.employeeId,
            status: item.status,
            date: today
        }));

        await Attendance.insertMany(records);

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