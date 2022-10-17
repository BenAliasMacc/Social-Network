const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const ObjectId  =require ('mongoose').Types.ObjectId;
const { registerErrors, updateErrors } = require('../utils/errors');

// Get Post
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Create Post
router.post('/', async (req, res) => {

    const { posterId, message, video, likers, comments } = req.body;

    try {
        const newPost = new Post({ posterId, message, video, likers, comments })
        const post = await newPost.save();
        res.status(201).send(post);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update Post
router.put('/:id', async (req, res) => {

    if(!ObjectId.isValid(req.params.id)) 
        return res.status(400).send('Identifiant inconnu : ' + req.params.id);

    try {
        const updatePost = await Post.findByIdAndUpdate(
            req.params.id, {
                $set: req.body
            },
            { new: true }
        )
        res.status(200).send(updatePost);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete Post
router.delete('/:id', async (req, res) => {
    if(!ObjectId.isValid(req.params.id)) 
        return res.status(400).send('Identifiant inconnu : ' + req.params.id);

    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).send('Message supprimé');
    } catch (error) {
        res.status(500).send(error);
    }    
});

// Like Post
router.patch('/like-post/:id', async (req, res) => {
    if(!ObjectId.isValid(req.params.id)) 
        return res.status(400).send('Identifiant inconnu : ' + req.params.id);

    // Add to the Post likes list
    try {
        const addLikes = await Post.findByIdAndUpdate(
            req.params.id, {
                $addToSet: { likers: req.body.id }
            },
            { new: true }
        );
        res.status(200).send(addLikes);
    } catch (error) {
        res.status(400).send(error);
    }
    // Add to the Likers list
    try {
        await User.findByIdAndUpdate(
            req.body.id, {
                $addToSet: { likes: req.params.id }
            },
            { new: true }
        );
    } catch (error) {
        res.status(400).send(error);
    }
});

// Unlike Post
router.patch('/unlike-post/:id', async (req, res) => {
    if(!ObjectId.isValid(req.params.id)) 
        return res.status(400).send('Identifiant inconnu : ' + req.params.id);

    // Remove from the Post likes list
    try {
        const unlikes = await Post.findByIdAndUpdate(
            req.params.id, {
                $pull: { likers: req.body.id }
            },
            { new: true }
        );
        res.status(200).send(unlikes);
    } catch (error) {
        res.status(400).send(error);
    }
    // Remove from the Likers list
    try {
        await User.findByIdAndUpdate(
            req.body.id, {
                $pull: { likes: req.params.id }
            },
            { new: true }
        );        
    } catch (error) {
        res.status(400).send(error);
    }
});

// Add Comments
router.patch('/comments/:id', async (req, res) => {
    if(!ObjectId.isValid(req.params.id)) 
        return res.status(400).send('Identifiant inconnu : ' + req.params.id);

    try {
        const newComment = await Post.findByIdAndUpdate(
            req.params.id, {
                $push: { 
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timeStamp: new Date().getTime()
                    }                                   
                }
            },
            { new: true },   
        );
        res.status(200).send(newComment);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Edit Comments
router.patch('/edit-comments/:id', async (req, res) => {
    if(!ObjectId.isValid(req.params.id)) 
        return res.status(400).send('Identifiant inconnu : ' + req.params.id);

    // try {
    //     return Post.findById(
    //         req.params.id,
    //         (err, docs) => {
    //             const commentToEdit = docs.comments.find((comment) => 
    //                 comment._id.equals(req.body.commentId)
    //             )
                
    //             if(!commentToEdit) return res.status(404).send('Commentaire introuvable');
    //             commentToEdit.text = req.body.text;

    //             return docs.save((error) => {
    //                 if(!error) return res.status(200).send(docs);
    //                 return res.status(500).send(error);
    //             })

    //         }
    //     )
    // } catch (error) {
    //     return res.status(400).send(error);
    // }

    try {
        const commentToEdit = await Post.findById(req.params.id)
        .then((post) => post.comments.find((comment) => comment._id.equals(req.body.commentId)))
        console.log(commentToEdit);
        try {
            commentToEdit.text = req.body.text;
            docs.save();
        } catch (error) {
            
        }
        return res.status(200).send(commentToEdit);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete Comments
router.patch('/delete-comments/:id', async (req, res) => {
    if(!ObjectId.isValid(req.params.id)) 
        return res.status(400).send('Identifiant inconnu : ' + req.params.id);

    try {
        const deleteComment = await Post.findByIdAndUpdate(
            req.params.id, {
                $pull: { comments: req.body.id }
            }
        )
        res.status(200).send(deleteComment);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;