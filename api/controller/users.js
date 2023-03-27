const User = require('../models/User');
const ObjectId  =require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const { updateErrors } = require('../utils/errors');

// Get All Users
module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // On récupere les elements de la DB présent dans la table User, et on enléve le mdp de la réponse
        res.status(200).send(users);       
    } catch (error) {        
        res.status(500).send(error);
    }
};

// Get User
module.exports.getUser = async (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('Identifiant inconnu : ' + req.params.id);

    try {
        const users = await User.findById(req.params.id); // On récupere les elements de la DB présent dans la table User, et on enléve le mdp de la réponse
        res.status(200).send(users);       
    } catch (error) {
        res.status(500).send(error);
    }
};

// Edit User
module.exports.editUser = async (req, res) => {
    
    if(!ObjectId.isValid(req.params.id)) 
        return res.status(400).send('Identifiant inconnu : ' + req.params.id);

    if(req.body.password && req.body.password.length >= 6 ) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);       
    } else {
        return res.status(500).send('Le mot de passe doit faire 6 caractéres minimum');
    }

    try {
        const updateUser = await User.findByIdAndUpdate(
            req.params.id, {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).send(updateUser);       
    } catch (error) {
        const errors = updateErrors(error);
        res.status(500).send({ errors });
    }
};

//Delete User
module.exports.deleteUser = async (req, res) => {
    if(!ObjectId.isValid(req.params.id)) 
        return res.status(400).send('Identifiant inconnu : ' + req.params.id);

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send(`L'utilisateur ${req.params.id} a été supprimé`);       
    } catch (error) {
        res.status(500).send(error);
    }
};

// Add Follow
module.exports.addFollow = async (req, res) => {
    if(!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToFollow)) 
        return res.status(400).send('Identifiant inconnu : ' + req.body.idToFollow);

    try {
        // add to the following list
        try {   
            const addFollow = await User.findByIdAndUpdate(
                req.params.id, {
                    $addToSet: { following: req.body.idToFollow }
                },
                { new: true }
            );
            res.status(200).send(addFollow);
        } catch (error) {
            res.status(400).send(error);
        };
        // add to the follower list
        try {   
            await User.findByIdAndUpdate(
                req.body.idToFollow, {
                    $addToSet: { followers: req.params.id }
                },
                { new: true }
            );
        } catch (error) {
            res.status(400).send(error);
        };
    } catch (error) {
        res.status(500).send(error);
    }
};

// Remove Follow
module.exports.removeFollow = async (req, res) => {
    if(!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToUnFollow)) 
        return res.status(400).send('Identifiant inconnu : ' + req.params.id);

    try {
        // remove from the following list
        try {
            const unFollow = await User.findByIdAndUpdate(
                req.params.id, {
                    $pull: {following: req.body.idToUnFollow}
                },
                { new: true }
            )
            res.status(201).send(unFollow);
        } catch (error) {
            res.status(400).send(error);
        }
        // remove from the follower list
        try {
            await User.findByIdAndUpdate(
                req.body.idToUnFollow, {
                    $pull: {followers: req.params.id}
                },
                { new: true }
            )
        } catch (error) {
            res.status(400).send(error);
        }
    } catch (error) {
        res.status(500).send(error);
    }
};