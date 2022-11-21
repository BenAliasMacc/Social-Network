const router = require('express').Router();
const { 
    getPosts, 
    createPost, 
    editPost, 
    deletePost, 
    likePost, 
    unlikePost, 
    addComment, 
    editComment, 
    deleteComment 
} = require('../controller/posts');
const multer = require('multer');
const upload = multer();

// Posts
router.get('/', getPosts);
router.post('/', upload.single('file'), createPost);
router.put('/:id', editPost);
router.delete('/:id', deletePost);

// Likes
router.patch('/like-post/:id', likePost);
router.patch('/unlike-post/:id', unlikePost);

// Comments
router.patch('/comments/:id', addComment);
router.patch('/edit-comment/:id', editComment);
router.patch('/delete-comment/:id', deleteComment);

module.exports = router;