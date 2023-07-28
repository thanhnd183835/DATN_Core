
const express = require('express');
const router = express.Router();
const controller = require('../controller/search');

const { requireSignIn, isAdmin } = require('../middleware');

router.get('/elasticsearch', requireSignIn, controller.search);

module.exports = router;
