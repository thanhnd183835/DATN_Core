const express = require('express');
const router = express.Router();
const controller = require('../controller/post');
const uploadCloud = require('../middleware/uploader');
const { requireSignIn } = require('../middleware/index');

router.post('/create-post', requireSignIn, uploadCloud.single('image'), controller.createNewPost);
router.get('/get-post/:id', requireSignIn, controller.getPostById);
router.get('/get-allPost', requireSignIn, controller.getPostUser);
router.get('/get-post-for-me', requireSignIn, controller.getPostForMe);
router.get('/get-post-for-friend/:id', requireSignIn, controller.getPostForFriend);
router.post('/remove-post/:id', requireSignIn, controller.removePost);
router.post('/like/:idPost', requireSignIn, controller.likePost);
router.post('/comment/:idPost', requireSignIn, controller.addComment);

module.exports = router;
