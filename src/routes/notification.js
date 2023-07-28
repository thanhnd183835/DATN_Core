
const express = require('express');
const router = express.Router();
const controller = require('../controller/notification');
const { requireSignIn } = require('../middleware');

router.post('/like/:idPost', requireSignIn, controller.likeNotification);

router.post('/comment/:idPost', requireSignIn, controller.commentNotification);

router.post('/follow/:idUser', requireSignIn, controller.followNotification);

// router.post('/accept-follow/:idUser', requireSignIn, controller.acceptFollowNotification);

router.post('/read', requireSignIn, controller.readNotification);

router.get('/get-all', requireSignIn, controller.getNotifications);

module.exports = router;
