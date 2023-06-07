const express = require('express');
const router = express.Router();
const controller = require('../controller/post');
const uploadCloud = require('../middleware/uploader');
const { requireSignIn } = require('../middleware/index');

router.post('/create-post', requireSignIn, uploadCloud.single('image'), controller.createNewPost);
router.post('/remove-post/:id', requireSignIn, controller.removePost);
router.post('/like/:idPost', requireSignIn, controller.likePost);
router.post('/comment/:idPost', requireSignIn, controller.addComment);

router.get('/get-post/:id', requireSignIn, controller.getPostById);
router.get('/get-allPost', requireSignIn, controller.getPostUser);
router.get('/get-post-for-me', requireSignIn, controller.getPostForMe);
router.get('/get-post-for-friend/:id', requireSignIn, controller.getPostForFriend);
router.get('/get-users-liked/:id', requireSignIn, controller.getListUserLiked);
router.get('/get-list-seafood', requireSignIn, controller.getListSeafood);
router.get('/get-list-vegetable', requireSignIn, controller.getListVegetable);
router.get('/get-list-fruit', requireSignIn, controller.getListFruit);
router.get('/get-list-confectionery', requireSignIn, controller.getListConfectionery);
router.get('/get-list-houseware', requireSignIn, controller.getListHouseware);
router.get('/get-list-electronic', requireSignIn, controller.getListElectronic);

module.exports = router;
