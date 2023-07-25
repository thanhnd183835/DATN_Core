const express = require('express');
const router = express.Router();
const controller = require('../controller/post');
const uploadCloud = require('../middleware/uploader');
const { requireSignIn } = require('../middleware/index');
const esClient = require('../ElasticSearch/elasticsearch');
const createIndexIfNotExists = async (req, res, next) => {
  const indexName = 'datn';
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

router.post(
  '/create-post',
  requireSignIn,
  createIndexIfNotExists,
  uploadCloud.single('image'),
  controller.createNewPost,
);
router.post('/delete-post/:idPost', requireSignIn, controller.deletePost);
router.post('/like/:idPost', requireSignIn, controller.likePost);
router.post('/comment/:idPost', requireSignIn, controller.addComment);
router.get('/get-post/:id', requireSignIn, controller.getPostById);
router.get('/get-all-post', requireSignIn, controller.getAllPost);
router.get('/get-all-post-with-subdivision/:subdivision', requireSignIn, controller.getPostWithSubDiViSon);
router.get('/get-post-for-me', requireSignIn, controller.getPostForMe);
router.get('/get-post-for-me/:typeItem', requireSignIn, controller.getPostForMeTypeItem);
router.get('/get-post-for-friend/:id', requireSignIn, controller.getPostForFriend);
router.get('/get-users-liked/:id', requireSignIn, controller.getListUserLiked);
router.get('/get-list-typeItem/:id/:typeItem', requireSignIn, controller.getListWithTypeItem);
router.get('/get-list-typeItem/:typeItem', requireSignIn, controller.getListWithItem);

module.exports = router;
