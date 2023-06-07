const express = require('express');
const router = express.Router();
const controller = require('../controller/auth');
const passport = require('passport');
const { requireSignIn, isAdmin } = require('../middleware');
const passportConfig = require('../middleware/passport');

router.post('/sign-in', controller.signIn);
router.post('/sign-up', controller.signUp);
router.post('/google', passport.authenticate('google-plus-token', { session: false }), controller.signInGoogle);
router.post('/facebook', passport.authenticate('facebook-token', { session: false }), controller.signInFacebook);
router.post('/replace-password', requireSignIn, controller.replacePassword);
router.post('/logout', requireSignIn, controller.logout);
module.exports = router;
