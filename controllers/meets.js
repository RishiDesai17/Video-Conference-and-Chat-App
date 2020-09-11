const Meet = require('../models/meet');
const User = require('../models/user');

exports.createMeet = async({ room, hostID }) => {
    try{
        const meet = await new Meet({
            room,
            members: [hostID]
        }).save();
        await User.findByIdAndUpdate(hostID, {
            $push: {
                meets: meet._id
            }
        })
    }
    catch(err){
        console.log(err)
    }
}

exports.addMember = async({ userID, meetID }) => {
    try{
        await User.findByIdAndUpdate(userID, {
            $push: {
                meets: meetID
            }
        })
    }
    catch(err){
        console.log(err)
    }
}