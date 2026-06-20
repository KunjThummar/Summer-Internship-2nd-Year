const {Salary} = require('../../models/salarySchema')

async function salaryToBePaid(req , res) {
    try {
        const result = await Salary.aggregate([
            {
                $group : {
                    _id : null,
                    totalSalary : {
                        $sum : '$netSalary'
                    }
                }
            }
        ])
        const total = result.length > 0 ? result[0].totalSalary : 0

        return res.status(200).json({Total_Salary : total})
    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}

module.exports = {salaryToBePaid}