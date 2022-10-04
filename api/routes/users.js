const router = require('express').Router();
const User = require('../models/User');
const ObjectId  =require ('mongoose').Types.ObjectId;

// Get All Users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // On récupere les elements de la DB présent dans la table User, et on enléve le mdp de la réponse
        res.status(200).json(users);       
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get User
router.get('/:id', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // On récupere les elements de la DB présent dans la table User, et on enléve le mdp de la réponse
        res.status(200).json(users);       
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/update')

module.exports = router;