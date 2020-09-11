const { extractJwt } = require('../infra/jwt');

module.exports = async(req,res,next) => {
    try {
        const decoded = await extractJwt()
        req.userData = decoded;
        next();
    }
    catch(err) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
}