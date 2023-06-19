const express = require('express');
const router = express.Router();
const controller = require('../controller/post');
const uploadCloud = require('../middleware/uploader');
const { requireSignIn } = require('../middleware/index');

router.post('/create-post', requireSignIn, uploadCloud.single('image'), controller.createNewPost);
router.post('/delete-post/:idPost', requireSignIn, controller.deletePost);
router.post('/like/:idPost', requireSignIn, controller.likePost);
router.post('/comment/:idPost', requireSignIn, controller.addComment);

router.get('/get-post/:id', requireSignIn, controller.getPostById);
router.get('/get-all-post', requireSignIn, controller.getAllPost);
router.get('/get-post-for-me', requireSignIn, controller.getPostForMe);
router.get('/get-post-for-me/:typeItem', requireSignIn, controller.getPostForMeTypeItem);
router.get('/get-post-for-friend/:id', requireSignIn, controller.getPostForFriend);
router.get('/get-users-liked/:id', requireSignIn, controller.getListUserLiked);
router.get('/get-list-typeItem/:id/:typeItem', requireSignIn, controller.getListWithTypeItem);
router.get('/get-list-typeItem/:typeItem', requireSignIn, controller.getListWithItem);

module.exports = router;
