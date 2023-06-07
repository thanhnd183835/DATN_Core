const Post = require('../models/post.js');
const User = require('../models/user');
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
    if (savePost) {
      await User.findOneAndUpdate({ _id: req.user._id }, { $push: { posts: { postId: post._id } } });
      return res.status(201).json({
        code: 0,
        data: savePost,
      });
    } else {
      if (UrlImg) cloudinary.uploader.destroy(UrlImg.filename);
      return res.status(400).json({ error: 'error when user create post' });
    }
  } catch (error) {
    if (UrlImg) cloudinary.uploader.destroy(UrlImg.filename);
    return res.status(500).json({
      code: 1,
      error: 'Server error',
    });
  }
};
// get post by id_post
module.exports.getPostById = async (req, res) => {
  const idPost = req.params.id;
  if (idPost) {
    Post.findById({ _id: idPost })
      .populate('postBy', ['userName', 'avatar'])
      .populate({ path: 'comments', populate: { path: 'userId', select: ['userName, avatar'] } })
      .sort('-updateAt')
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
      .sort('-updateAt');
    then((posts) => {
      res.status(200).json({
        code: 0,
        data: posts,
      });
    }).catch((err) => {
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
module.exports.removePost = async (req, res) => {
  try {
    const idPost = req.params.id;
    const removePost = await Post.findByIdAndUpdate({ _id: idPost, statusPost: 'active' }, { statusPost: 'deleted' });
    if (!removePost) {
      return res.status(404).json({ code: 0, message: 'Post not found' });
    }
    if (removePost) {
      return res.status(200).json({
        code: 0,
        message: 'Delete post success',
      });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};
// like Post
module.exports.likePost = async (req, res) => {
  try {
    const idPost = req.params.postId;
    const checkPostExist = await Post.findOne({ _id: idPost, statusPost: 'active' });
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
// get post hai san
module.exports.getListSeafood = async (req, res) => {
  try {
    const typeItem = 'Hải Sản';
    const listSeafood = await Post.find({ typeItem: typeItem });
    if (!listSeafood) {
      return res.status(404).json({ code: 1, message: 'Sea Food not found' });
    }
    return res.status(200).json({ code: 0, data: listSeafood });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// get post rau củ
module.exports.getListVegetable = async (req, res) => {
  try {
    const typeItem = 'Rau Củ';
    const listSeafood = await Post.find({ typeItem: typeItem });
    if (!listSeafood) {
      return res.status(404).json({ code: 1, message: 'Vegetable not found' });
    }
    return res.status(200).json({ code: 0, data: listSeafood });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// get post Hoa quả
module.exports.getListFruit = async (req, res) => {
  try {
    const typeItem = 'Hoa Quả';
    const listSeafood = await Post.find({ typeItem: typeItem });
    if (!listSeafood) {
      return res.status(404).json({ code: 1, message: 'Fruit not found' });
    }
    return res.status(200).json({ code: 0, data: listSeafood });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// get post Bánh kẹo
module.exports.getListConfectionery = async (req, res) => {
  try {
    const typeItem = 'Bánh Kẹo';
    const listSeafood = await Post.find({ typeItem: typeItem });
    if (!listSeafood) {
      return res.status(404).json({ code: 1, message: 'Confectionery not found' });
    }
    return res.status(200).json({ code: 0, data: listSeafood });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// get post đồ gia dụng
module.exports.getListHouseware = async (req, res) => {
  try {
    const typeItem = 'Đồ Gia Dụng';
    const listSeafood = await Post.find({ typeItem: typeItem });
    if (!listSeafood) {
      return res.status(404).json({ code: 1, message: 'Houseware not found' });
    }
    return res.status(200).json({ code: 0, data: listSeafood });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// get post đồ điện tử
module.exports.getListElectronic = async (req, res) => {
  try {
    const typeItem = 'Đồ Điện Tử';
    const listSeafood = await Post.find({ typeItem: typeItem });
    if (!listSeafood) {
      return res.status(404).json({ code: 1, message: 'Electronic not found' });
    }
    return res.status(200).json({ code: 0, data: listSeafood });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
