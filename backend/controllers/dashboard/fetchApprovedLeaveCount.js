const { Leave } = require('../../models/leaveSchema');

async function fetchApprovedLeaveCount(req, res) {
    try {

        const approvedLeaveCount = await Leave.countDocuments({ status: 'approved' });
        return res.status(200).json({ success: true, approvedLeaveCount });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { fetchApprovedLeaveCount };
