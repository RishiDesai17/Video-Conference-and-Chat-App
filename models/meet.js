const mongoose = require('mongoose')

const meetSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
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
