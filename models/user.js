const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    meets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meet'
    }]
},
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)
