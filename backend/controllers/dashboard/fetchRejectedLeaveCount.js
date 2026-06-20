const { Leave } = require('../../models/leaveSchema');

async function fetchRejectedLeaveCount(req, res) {
    try {
        const rejectedLeaveCount = await Leave.countDocuments({ status: 'rejected' });
        return res.status(200).json({ success: true, rejectedLeaveCount });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { fetchRejectedLeaveCount };