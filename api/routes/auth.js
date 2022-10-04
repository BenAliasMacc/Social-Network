const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

// REGISTER
router.post("/register", async (req,res) => {
    
    const { pseudo, email, password } = req.body;   

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({ pseudo, email, password: hashedPassword })
        const user = await newUser.save();
        res.status(201).json(user._id);
    } catch (error) {
        res.status(500).json(error)
    }
})

// // LOGIN
// router.post("/login", async (req,res) => {
//     try {
//         const user = await User.findOne({username: req.body.username});
//         !user && res.status(400).json("Wrong credentials!");

//         const validated = await bcrypt.compare(req.body.password, user.password);
//         !validated && res.status(400).json("Wrong credentials!");

//         const {password, ...others} = user._doc;
//         res.status(200).json(others)
//     } catch (error) {
//         res.status(500).json(error)
//     }
// })

module.exports = router;