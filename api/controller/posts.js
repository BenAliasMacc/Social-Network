const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const { uploadErrors } = require('../utils/errors');
const ObjectId  =require ('mongoose').Types.ObjectId;

// Get Post
module.exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Create Post
module.exports.createPost = async (req, res) => {

    let fileName;

    if(req.file !== null && req.file !== undefined) {
        // try {
        //     if (                
        //         req.file.detectedMimeType != 'image/jpg' &&
        //         req.file.detectedMimeType != 'image/png' &&
        //         req.file.detectedMimeType != 'image/jpeg'
    
        //     ) throw Error('Invalid file');
    
        //     if (req.file.size > 500000) throw Error('Max size')
            
        // } catch (error) {
        //     const errors = uploadErrors(error);
        //     return res.status(201).json({ errors });
        // };
    
        fileName = req.body.posterId + Date.now() + '.jpg';

        if (req.file.buffer) {
            
            await fs.promises.writeFile(`${__dirname}/../uploads/posts/${fileName}`, req.file.buffer);
        } else {
            console.log('req.file.buffer is undefined');
        }
    };

    const newPost = new Post({ 
        posterId: req.body.posterId, 
        message: req.body.message, 
        picture: req.file !== null && req.file !== undefined ? './uploads/posts/' + fileName : '',
        video: req.body.video,
        likers: [], 
        comments: [],
    })
    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (error) {
        return res.status(400).send(error);
    }
};

// Edit Post
module.exports.editPost = async (req, res) => {

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
};

// Delete Post
module.exports.deletePost = async (req, res) => {
    if(!ObjectId.isValid(req.params.id)) 
        return res.status(400).send('Identifiant inconnu : ' + req.params.id);

    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).send('Message supprimé');
    } catch (error) {
        res.status(500).send(error);
    }    
};

// Like Post
module.exports.likePost = async (req, res) => {
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
};

// Unlike Post
module.exports.unlikePost = async (req, res) => {
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
};

// Add Comment
module.exports.addComment = async (req, res) => {
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
};

// Edit Comment
module.exports.editComment = async (req, res) => {
    const { id } = req.params;
    const { commentId, text } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send(`Identifiant inconnu : ${id}`);
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).send('Publication introuvable');
        }

        const commentToEdit = post.comments.find((comment) => 
            comment._id.equals(commentId)
        );
        if (!commentToEdit) {
            return res.status(404).send('Commentaire introuvable');
        }

        commentToEdit.text = text;
        await post.save();

        return res.status(200).send(post);
    } catch (error) {
        return res.status(500).send(error);
    }

    // try {
    //     const commentToEdit = await Post.findById(req.params.id)
    //     .then((post) => post.comments.find((comment) => comment._id.equals(req.body.commentId)))
    //     console.log(commentToEdit);
    //     try {
    //         commentToEdit.text = req.body.text;
    //         docs.save();
    //     } catch (error) {
            
    //     }
    //     return res.status(200).send(commentToEdit);
    // } catch (error) {
    //     res.status(500).send(error);
    // }
};

// Delete Comment
module.exports.deleteComment = async (req, res) => {
    if(!ObjectId.isValid(req.params.id)) 
        return res.status(400).send('Identifiant inconnu : ' + req.params.id);

    try {
        const deletedComment = await Post.findByIdAndUpdate(
            req.params.id, {
                $pull: {
                    comments: {
                        _id: req.body.commentId
                    }                    
                }
            },
            { new: true }
        )
        res.status(200).send(deletedComment);
    } catch (error) {
        return res.status(400).send(error);
    }
};