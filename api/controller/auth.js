const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { registerErrors, loginErrors } = require('../utils/errors');

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    });
};

// REGISTER
module.exports.register = async (req,res) => {
    
    const { pseudo, email, password } = req.body;
    
    try {
        const newUser = new User({ pseudo, email, password })
        const user = await newUser.save();
        res.status(201).send(user._id);
    } catch (error) {
        const errors = registerErrors(error)
        res.status(500).send({ errors });
    };
};

// LOGIN
module.exports.login = async (req, res) => {
  
    try {
      const user = await User.login(req.body.email, req.body.password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge, sameSite: "none", secure: true });
      res.status(200).json({ user: user._id});
    } catch (err){
      const errors = loginErrors(err);
      res.status(200).json({ errors });
    }
}

// LOGOUT
module.exports.logout = async (req,res) => {
    console.log("test");
    res.cookie('jwt', '', { httpOnly: true, maxAge: 1, sameSite: "none", secure: true  });
    res.redirect('/');
};