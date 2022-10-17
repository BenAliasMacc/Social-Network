const router = require('express').Router();
const { uploadProfilPic } = require('../controller/upload');
const { 
    getAllUsers, 
    getUser, 
    editUser, 
    deleteUser, 
    addFollow, 
    removeFollow, 
    logout 
} = require('../controller/users');
const multer = require('multer');
const upload = multer();

// Users
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', editUser);
router.delete('/:id', deleteUser);
router.post('/logout', logout);

// Follow
router.patch('/follow/:id', addFollow);
router.patch('/unfollow/:id', removeFollow);

// Upload
router.post('/upload', upload.single('file'), uploadProfilPic);

module.exports = router;