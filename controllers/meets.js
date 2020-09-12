const Meet = require('../models/meet');
const User = require('../models/user');

exports.getPastMeetsOfUser = async(req, res) => {
    try{
        const { id } = req.userData
        const user = await User.findById(id, 'meets').populate({
            path : 'meets',
            select: ['members', 'createdAt'],
            populate : {
                path : 'members',
                select: ['name']
            }
        })
        return res.status(200).json({
            meets: user.meets
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            SOMETHING_WENT_WRONG: 'Something went wrong, Please try again'
        })
    }
}