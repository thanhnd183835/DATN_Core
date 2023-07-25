const express = require('express');
const router = express.Router();
const controller = require('../controller/auth');
const passport = require('passport');
const { requireSignIn, isAdmin } = require('../middleware');
const esClient = require('../ElasticSearch/elasticsearch');
const passportConfig = require('../middleware/passport');
const createIndexIfNotExists = async (req, res, next) => {
  const indexName = 'datn-user';
  try {
    const { body: indexExists } = await esClient.indices.exists({ index: indexName });

    if (!indexExists) {
      await esClient.indices.create({ index: indexName });
      console.log(`Created index '${indexName}'`);
    } else {
      console.log(`Index '${indexName}' already exists`);
    }

    next();
  } catch (error) {
    console.log(error);
    if (error.statusCode === 400) {
      // Nếu chỉ mục đã tồn tại, bỏ qua lỗi
      console.log(`Index '${indexName}' already exists`);
      next();
    } else {
      console.error(`Failed to create index '${indexName}': ${error}`);
      res.status(500).send('Internal Server Error');
    }
  }
};
router.post('/sign-in', controller.signIn);
router.post('/sign-up', createIndexIfNotExists, controller.signUp);
router.post('/google', passport.authenticate('google-plus-token', { session: false }), controller.signInGoogle);
router.post('/facebook', passport.authenticate('facebook-token', { session: false }), controller.signInFacebook);
router.post('/replace-password', requireSignIn, controller.replacePassword);
router.post('/logout', requireSignIn, controller.logout);
module.exports = router;
