const express = require('express');
const router = express.Router();
const controller = require('../controller/user');
const { requireSignIn, isAdmin } = require('../middleware');
const uploadCloud = require('../middleware/uploader');

router.post('/follow/:id', requireSignIn, controller.follow);
router.post('/un-follow/:id', requireSignIn, controller.unFollow);
router.post('/change-avatar', requireSignIn, uploadCloud.single('image'), controller.changeAvatar);
router.post('/edit-profile', requireSignIn, controller.editProfile);
router.get('/get-me', requireSignIn, controller.getMe);
router.get('/profile-friend/:id', requireSignIn, controller.getProfileFriend);
router.get('/get-all-follower', requireSignIn, controller.getAllUserFollower);
router.get('/get-all-following', requireSignIn, controller.getAllUserFollowing);
router.get('/get-all-user', requireSignIn, controller.getallUser);
router.post('/confirm-sale-point/:id', requireSignIn, isAdmin, controller.confirmSalePoint);
router.post('/cancel-sell/:id', requireSignIn, isAdmin, controller.cancelSell);
router.post('/send-email', requireSignIn, controller.sendEmail);


module.exports = router;
