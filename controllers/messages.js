const Meet = require('../models/meet');

exports.getTranscript = async(req, res) => {
    try{
        const { id } = req.userData
        const meet = Meet.findById(req.body.meetID)
        if(!meet.members.includes(id)){
            return res.status(401).json({
                UNAUTHORIZED: "You were not a part of this meeting"
            })
        }
        return res.status(200).json({
            transcript: meet.messages
        })
    }
    catch(err){
        console.log(err)
    }
}