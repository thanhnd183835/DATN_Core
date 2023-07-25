const esClient = require('../ElasticSearch/elasticsearch.js');
const Post = require('../models/post.js');
const User = require('../models/user');
const { logout } = require('./auth.js');
const cloudinary = require('cloudinary').v2;
// tao bai post
module.exports.createNewPost = async (req, res) => {
  try {
    const { name, price, typeItem, description, detailItem } = req.body;
    const UrlImg = req.file;
    const post = new Post({
      name: name,
      price: price,
      typeItem: typeItem,
      description: description,
      detailItem: detailItem,
      UrlImg: UrlImg.path,
      postBy: req.user._id,
    });
    const savePost = await post.save();
    await esClient.index({
      index: 'datn',
      id: savePost._id,
      body: {
        postId: savePost._id,
        name: savePost.name,
        UrlImg: savePost.UrlImg,
        price: savePost.price,
        description: savePost.description,
        detailItem: savePost.detailItem,
        like: savePost.likes,
      },
    });
    if (savePost) {
      await User.findOneAndUpdate({ _id: req.user._id }, { $push: { posts: { postId: post._id } } });
      return res.status(201).json({
        code: 0,
        data: savePost,
      });
    } else {
      if (UrlImg) cloudinary.uploader.destroy(UrlImg.fileName);
      return res.status(400).json({ error: 'error when user create post' });
    }
  } catch (error) {
    return res.status(500).json({
      code: 1,
      error: error,
    });
  }
};
// get post by id_post
module.exports.getPostById = async (req, res) => {
  const idPost = req.params.id;
  if (idPost) {
    Post.findById({ _id: idPost })
      .populate('postBy', ['userName', 'avatar'])
      .populate({ path: 'comments', populate: { path: 'userId', select: ['userName', 'avatar', '_id'] } })
      // .populate({path:'updatedAt'},populate:{path:'userId', select:['updatedAt'] })
      .then((post) => {
        res.status(200).json({
          code: 0,
          data: post,
        });
      })
      .catch((error) => {
        return res.status(500).json({ error: 'server error' });
      });
  }
};
// get all post của user minh dang theo doi.
module.exports.getPostUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).populate({
    path: 'following',
    populate: { path: 'userId', select: ['_id', 'role'] },
  });
  if (user) {
    const listFollowing = user.following
      .filter((obj) => {
        return obj.userId && obj.userId.role !== 2;
      })
      .map((obj) => obj.userId._id);
    Post.find({ postBy: { $in: listFollowing }, role: 1 })
      .populate('postBy', ['userName', 'avatar', 'role'])
      .populate({ path: 'comments', populate: { path: 'userId', select: 'userName' } })
      .sort('-updateAt')
      .then((posts) => {
        res.status(200).json({
          code: 0,
          data: posts,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          err: 'server error',
        });
      });
  }
};
// get post for me
module.exports.getPostForMe = async (req, res) => {
  try {
    const currentId = req.user._id;

    const user = await User.findOne({ _id: currentId });
    if (!user) {
      return res.status(404).json({ message: 'User not find' });
    }
    const posts = await Post.find({ postBy: currentId });
    if (!posts) {
      return res.status(404).json({ message: 'Not find post ' });
    }
    return res.status(200).json({ code: 0, data: posts });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};
// get post for friend
module.exports.getPostForFriend = async (req, res) => {
  try {
    const idFriend = req.params.id;
    const user = await User.findOne({ _id: idFriend });
    if (!user) {
      return res.status(404).json({ message: 'User not find' });
    }
    const posts = await Post.find({ postBy: idFriend });
    if (!posts) {
      return res.status(404).json({ message: 'Not find post ' });
    }
    return res.status(200).json({ code: 0, data: posts });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// xoa bai post
module.exports.deletePost = async (req, res) => {
  try {
    const idPost = req.params.idPost;

    const userUpdate = await User.findOneAndUpdate(
      { 'posts.postId': idPost },
      { $pull: { posts: { postId: idPost } } },
    );

    if (!userUpdate) {
      return res.status(404).json({ code: 0, message: 'User Not Found!' });
    }
    const deletePost = await Post.findOneAndRemove({ _id: idPost });
    if (!deletePost) {
      return res.status(404).json({ code: 0, message: 'Post Not Found!' });
    }
    const deleteFromElasticsearch = await esClient.delete({
      index: 'datn', // Thay đổi tên chỉ mục của bạn
      id: idPost,
    });

    if (deleteFromElasticsearch.statusCode !== 200) {
      return res.status(500).json({ code: 0, message: 'Failed to delete post from Elasticsearch' });
    }
    if (deletePost) {
      return res.status(200).json({
        code: 0,
        message: 'Delete Forever post success',
      });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// like Post
module.exports.likePost = async (req, res) => {
  try {
    const idPost = req.params.idPost;

    const checkPostExist = await Post.findOne({ _id: idPost });
    if (!checkPostExist) {
      return res.status(404).json({ code: 0, message: 'Post Not Found!' });
    }
    const userLike = req.user._id;
    const checkInList = await Post.findOne({ _id: idPost, 'likes.userId': userLike });
    const update = checkInList
      ? {
          $pull: {
            likes: {
              userId: userLike,
            },
          },
        }
      : {
          $push: {
            likes: {
              userId: userLike,
            },
          },
        };
    const postUpdate = await Post.findOneAndUpdate({ _id: idPost }, update);
    if (postUpdate) {
      return res.status(200).json({ code: 0, message: 'react post successfully' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};
// add comment
module.exports.addComment = async (req, res) => {
  try {
    const idPost = req.params.idPost;
    const update = {
      $push: {
        comments: {
          userId: req.body.userId,
          content: req.body.content,
        },
      },
    };
    const postUpdate = await Post.findOneAndUpdate({ _id: idPost, statusPost: 'active' }, update);
    if (!postUpdate) {
      return res.status(404).json({ code: 0, message: 'Post Not Found!' });
    }
    if (postUpdate) {
      return res.status(200).json({ code: 0, message: 'add comment successfully' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};
// get list user like
module.exports.getListUserLiked = async (req, res) => {
  try {
    const idPost = req.params.id;
    const listUserLiked = await Post.findOne({ _id: idPost }).populate({
      path: 'likes',
      populate: { path: 'userId', select: ['avatar', 'userName', '_id'] },
    });
    if (!listUserLiked) {
      return res.status(404).json({ code: 1, message: 'Post not found' });
    }
    return res.status(200).json({ code: 0, data: listUserLiked });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// get post with type Item
module.exports.getListWithTypeItem = async (req, res) => {
  try {
    const idUser = req.params.id;
    const typePost = req.params.typeItem;

    if (typePost === 'all') {
      const listPost = await Post.find({ postBy: idUser });

      return res.status(200).json({ code: 0, data: listPost });
    } else {
      const ListWithTypeItem = await Post.find({ typeItem: typePost, postBy: idUser });
      if (!ListWithTypeItem) {
        return res.status(404).json({ code: 1, message: 'Page not found' });
      }
      return res.status(200).json({ code: 0, data: ListWithTypeItem });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports.getAllPost = async (req, res) => {
  try {
    // const ListUser = await User.find({ role: 1, subDiViSon: req.user.subDiViSon });
    const limit = parseInt(req.query.limit) || 18;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const listPost = await Post.find({});
    if (!listPost) {
      return res.status(404).json({ message: 'Not find post ' });
    }
    const result = listPost.slice(startIndex, endIndex);
    let isLastPage = false;
    if (result < 18) {
      isLastPage = true;
    }
    return res.status(200).json({ code: 0, data: result, isLastPage: isLastPage });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
module.exports.getPostWithSubDiViSon = async (req, res) => {
  try {
    const subDiViSon = req.params.subdivision;
    const ListUser = await User.find({ role: 1, subDiViSon: subDiViSon });
    if (!ListUser) {
      return res.status(404).json({ code: 1, message: 'User not found' });
    }
    const listIdUser = ListUser.map((user) => user._id);
    const listPost = await Post.find({
      postBy: { $in: listIdUser },
    });
    return res.status(200).json({ data: listPost });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
module.exports.getPostForMeTypeItem = async (req, res) => {
  try {
    const typePost = req.params.typeItem;
    if (typePost === 'all') {
      const listPost = await Post.find({});

      return res.status(200).json({ code: 0, data: listPost });
    } else {
      const ListWithTypeItem = await Post.find({ typeItem: typePost });
      if (!ListWithTypeItem) {
        return res.status(404).json({ code: 1, message: 'Page not found' });
      }
      return res.status(200).json({ code: 0, data: ListWithTypeItem });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
module.exports.getListWithItem = async (req, res) => {
  try {
    const typePost = req.params.typeItem;

    const list = await Post.find({ typeItem: typePost });

    if (!list) {
      return res.status(404).json({ code: 1, message: 'Page not found' });
    }
    return res.status(200).json({ code: 0, data: list });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
