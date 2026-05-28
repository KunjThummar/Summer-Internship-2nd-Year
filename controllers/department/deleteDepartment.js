const {Department} = require('../../models/departmentSchema');

async function deleteDepartment(req , res){
    try {
        const departmentId = req.params.id;
        const departmentDeleted = await Department.findByIdAndDelete(departmentId);
        
        if(!departmentDeleted){
            return res.status(404).json({ msg : 'No department found'})
        }

        return res.status(200).json({ msg : 'Department deleted successfully'})
    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}

module.exports = { deleteDepartment };
