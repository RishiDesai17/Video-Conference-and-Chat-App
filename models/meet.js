const mongoose = require('mongoose')

const meetSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true
    },
    members: [{
        type: String,
        ref: 'User'
    }],
    messages: [{
        message: {
            type: String,
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }],
},
{
    timestamps: true
})

module.exports = mongoose.model('Meet', meetSchema)
