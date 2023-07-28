
const express = require('express');
const router = express.Router();
const controller = require('../controller/chat');
const uploadCloud = require('../middleware/uploader');
const { requireSignIn } = require('../middleware');


router.post('/inbox', requireSignIn, uploadCloud.single('image'), controller.addMessage);

router.get('/get-list-message/:idReceiver', requireSignIn, controller.getListMessage);

router.get('/get-rooms', requireSignIn, controller.getChatRoom);

module.exports = router;
