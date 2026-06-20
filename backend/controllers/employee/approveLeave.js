const { Leave } = require('../../models/leaveSchema');
const { Employee } = require('../../models/employeeSchema');

async function approveLeave(req, res) {
    try {
        const leaveId = req.params.leaveId;
        const { approved, comments } = req.body;

        if (!leaveId) {
            return res.status(400).json({ error: "Leave ID required" });
        }

        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return res.status(404).json({ error: "Leave not found" });
        }

        leave.status = approved ? 'approved' : 'rejected';
        leave.reviewedAt = new Date();
        leave.reviewedBy = req.user.id;
        if (comments) leave.comments = comments;

        await leave.save();
        return res.status(200).json({ 
            success: true, 
            message: `Leave ${approved ? 'approved' : 'rejected'}`,
            leave 
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { approveLeave };