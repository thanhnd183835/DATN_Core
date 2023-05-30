const Post = require('../models/post.js');
const User = require('../models/user.js');
const Notification = require('../models/notification.js');

// add notification to db when user like picture
module.exports.likeNotification = async (req, res) => {
  try {
    const idPost = req.params.idPost;
    const userLiked = await User.findOne({ _id: req.user._id });
    if (!userLiked) {
      return res.status(404).json({ message: 'User Not Found' });
    }
    const post = await Post.findOne({ _id: idPost });
    if (!post) {
      return res.status(404).json({ message: 'Post Not Found' });
    }
    const owner = post.postBy;
    const notification = new Notification({
      otherUser: req.user._id, // thang dang dang nhap
      userId: owner, // id cua thang dang bai post
      content: `Đã thích sản phẩm của bạn`,
      post: post._id, // id bai post
      statusNotification: 'not seen',
    });
    const CreateNotification = await notification.save();
    if (CreateNotification) {
      await User.findOneAndUpdate(
        { _id: owner },
        { $push: { notifications: { notificationId: CreateNotification._id } } },
      );
      return res.status(200).json({
        code: 0,
        data: notification,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
    });
  }
};
// add notification when user comment to post of friend
module.exports.commentNotification = async (req, res) => {
  try {
    const idPost = req.params.idPost;
    const userCommented = await User.findOne({ _id: req.user._id });
    if (!userCommented) {
      return res.status(404).json({ status: 'User Not Found' });
    }
    const post = await Post.findOne({ _id: idPost });
    if (!post) {
      return res.status(404).json({ message: 'Post Not Found' });
    }
    const owner = post.postBy;
    const notification = new Notification({
      otherUser: req.user._id, // thang dang dang nhap
      userId: owner, // id cua thang dang bai post
      content: `Đã đánh giá sản phẩm của bạn`,
      post: post._id, // id bai post
      statusNotification: 'not seen',
    });
    const createNotification = await notification.save();
    if (createNotification) {
      await User.findOneAndUpdate(
        { _id: owner },
        { $push: { notifications: { notificationId: createNotification._id } } },
      );
      return res.status(200).json({
        code: 0,
        data: notification,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
// add data notification when user follow other user
module.exports.followNotification = async (req, res) => {
  try {
    const idUserFollowed = req.params.idUser;
    const currentUser = await User.findOne({ _id: req.user._id });
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const notification = new Notification({
      otherUser: req.user._id,
      userId: idUserFollowed,
      content: `đã theo dõi bạn`,
      statusNotification: 'not seen',
    });
    const createNotification = await notification.save();
    if (createNotification) {
      await User.findOneAndUpdate(
        { _id: idUserFollowed },
        { $push: { notifications: { notificationId: createNotification._id } } },
      );
      return res.status(200).json({ code: 0, data: notification });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
// get notification by user_id.
module.exports.getNotifications = async (req, res) => {
  try {
    const currentId = req.user._id;
    const listNotification = await Notification.find({ userId: currentId })
      .populate({
        path: 'post',
        select: ['pictures', ['likes'], 'statusPost'],
      })
      .populate({ path: 'otherUser', select: ['userName', 'avatar'] })
      .sort({ createdAt: -1 });

    if (listNotification) {
      return res.status(200).json({ code: 0, data: listNotification });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
// mark notification is read
module.exports.readNotification = async (req, res) => {
  try {
    const currentId = req.user._id;
    const updateStatus = await Notification.updateMany(
      { userId: currentId, statusNotification: 'not seen' },
      { statusNotification: 'seen' },
    );
    if (updateStatus) {
      return res.status(200).json({ code: 0, data: updateStatus });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
