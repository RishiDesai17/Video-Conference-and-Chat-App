const jwt = require('jsonwebtoken');

exports.verifyJwt = (token_for_websocket_verification) => {
    if(token_for_websocket_verification) {
        return jwt.verify(token_for_websocket_verification, process.env.SECRETKEY);
    }
    const token = req.headers.authorization.split(' ')[1];
    return jwt.verify(token, process.env.SECRETKEY);
}

exports.generateTokens = async(id, name) => {
    return await Promise.all([jwt.sign({ id, name }, process.env.SECRETKEY, {
        expiresIn: '6000s'
    }), jwt.sign({ id, name }, process.env.REFRESHTOKENKEY, {
        expiresIn: 15778800000
    })])
}