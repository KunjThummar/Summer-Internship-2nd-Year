const { Leave } = require('../../models/leaveSchema');

async function fetchPendingLeaveCount(req, res) {
    try {
        const pendingLeaveCount = await Leave.countDocuments({ status: 'pending' });
        return res.status(200).json({ success: true, pendingLeaveCount });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }  
}

module.exports = { fetchPendingLeaveCount };