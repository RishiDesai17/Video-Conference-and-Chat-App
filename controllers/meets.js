const Meet = require('../models/meet');
const User = require('../models/user');

exports.createMeet = async({ roomID, hostID }) => {
    try{
        // console.log(roomID)
        const meet = await new Meet({
            _id: roomID,
            members: [hostID]
        }).save();
        await User.findByIdAndUpdate(hostID, {
            $push: {
                'meets': meet._id
            }
        })
    }
    catch(err){
        console.log(err)
    }
}

exports.addMember = async({ roomID, userID }) => {
    try{
        await Promise.all([
            User.findByIdAndUpdate(userID, {
                $push: {
                    'meets': roomID
                }
            }),
            Meet.findByIdAndUpdate(roomID, {
                $push: {
                    'members': userID
                }
            })
        ])
    }
    catch(err){
        console.log(err)
    }
}