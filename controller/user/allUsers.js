const userModel = require("../../model/userModel");

async function AllUsers(req,res) {
    try {
        const allUsers = await userModel.find()
        res.json({
            message: 'All Users found in the database successfully',
            error: false,
            success: true,
            data: allUsers
        })
    } catch (error) {
       res.status(400).json({
         message: error.message || error,
         error: true,
         success: false,
       }); 
    }
}

module.exports = AllUsers