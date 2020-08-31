const jwt = require('jsonwebtoken')

exports.generateTokens = async(id, name) => {
    return await Promise.all([jwt.sign({ id, name }, process.env.SECRETKEY, {
        expiresIn: '6000s'
    }), jwt.sign({ id, name }, process.env.REFRESHTOKENKEY, {
        expiresIn: 15778800000
    })])
}