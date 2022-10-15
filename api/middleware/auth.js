const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports.checkUser = (req, res, next) => {    
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (error, decodedToken) => {
            if (error) {
                res.locals.user = null;
                res.cookies('jwt', '', { maxAge: 1 });
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (error, decodedToken) => {
            if (error) {
                console.log(error);
            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        console.log('No Token');
    }
}