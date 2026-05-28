const {User} = require('../../models/userSchema')

async function fetchEmployees(req , res){
    try {
        const employees = await User.find({role : 'employee'}).select('-password');
        return res.status(200).json({msg : "employees fetched successfully" , employees})
    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}

module.exports = {fetchEmployees}