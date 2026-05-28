const {Department} = require('../../models/departmentSchema');

async function updateDepartment(req , res){
    try {
        const departmentId = req.params.id;
        const {departmentName , departmentDescription} = req.body;
        const departmentUpdated = await Department.findByIdAndUpdate(
            departmentId,
        {
            dep_name : departmentName,
            description : departmentDescription
        }, {new : true})

        if(!departmentUpdated){
            return res.status(404).json({ msg : 'No department found'})
        }

        return res.status(200).json({ msg : 'Department updated successfully'})
    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}

module.exports = { updateDepartment };
