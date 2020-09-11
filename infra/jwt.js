const jwt = require('jsonwebtoken');

exports.verifyJwt = token => {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    return decoded
}

exports.extractJwt = () => {
    const token = req.headers.authorization.split(' ')[1];
    return this.verifyJwt(token)
}

exports.generateTokens = async(id, name) => {
    return await Promise.all([jwt.sign({ id, name }, process.env.SECRETKEY, {
        expiresIn: '6000s'
    }), jwt.sign({ id, name }, process.env.REFRESHTOKENKEY, {
        expiresIn: 15778800000
    })])
}