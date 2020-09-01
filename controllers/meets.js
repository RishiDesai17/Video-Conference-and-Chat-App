const Meet = require('../models/meet');

exports.createMeet = async(room, hostID) => {
    try{
        await new Meet({
            room,
            members: [hostID]
        }).save()
    }
    catch(err){
        console.log(err)
    }
}