const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { generateTokens } = require('../infra/jwt');
const User = require('../models/user')

exports.login = async(req, res) => {
    try{
        const user = await User.find({ email: req.body.email }).select("+password").limit(1);
        if(user.length === 0){
            return res.status(404).json({
                NOT_FOUND: 'This account does not exist'
            })
        }
        const isValid = await bcrypt.compare(req.body.password, user[0].password)
        if(!isValid){
            return res.status(401).json({
                UNAUTHORIZED: 'Invalid credentials'
            })
        }
        user[0].password = undefined
        const tokenpair = await generateTokens(user[0]._id, user[0].name)
        const dt = new Date()
        res.cookie('refresh_token_video_conf', tokenpair[1], {
            httpOnly: true,
            sameSite: true,
            expires: new Date(dt.setMonth(dt.getMonth()+6)),
            secure: false
        })
        return res.status(200).json({
            message: 'Authorization successful',
            profile: user,
            access_token: tokenpair[0]
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            SOMETHING_WENT_WRONG: 'Something went wrong, Please try again'
        })
    }
}

exports.register = async(req, res) => {
    try{
        const exisitingUser = await User.find({ email: req.body.email }).limit(1)
        if(exisitingUser.length > 0) {
            return res.status(409).json({
                message: "Email already exists"
            })
        }
        const { name, email, password } = req.body
        const hash = await bcrypt.hash(password, 10)
        const user = await new User({
            name,
            email,
            password: hash
        }).save()
        return res.status(201).json({
            message: 'Your account has been created. Please Login'
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            SOMETHING_WENT_WRONG: 'Something went wrong, Please try again'
        })
    }
}

exports.logout = (req, res) => {
    try{
        res.clearCookie("refresh_token_video_conf");
        return res.status(200).json({
            message: 'Logged out'
        })
    }
    catch(err){
        return res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

exports.refresh = async(req, res) => {
    try{
        if(!req.cookies.refresh_token_video_conf){
            return res.status(401).json({
                message: 'Authorization failed'
            })
        }
        
        const { id, name } = jwt.verify(req.cookies.refresh_token_video_conf, process.env.REFRESHTOKENKEY)
        // console.log(id)
        const access_token = jwt.sign({ id, name }, process.env.SECRETKEY, {
            expiresIn: '600s'
        })
        if(req.body.getprofile){
            const profile = await User.findById(id)
            if(profile === null){
                return res.status(404).json({
                    message: 'Account Not Found'
                })
            }
            return res.status(200).json({
                profile,
                access_token
            })
        }
        return res.status(200).json({
            access_token
        })
    }
    catch(err){
        console.log(err)
        return res.status(401).json({
            message: 'Authorization failed'
        })
    }
}