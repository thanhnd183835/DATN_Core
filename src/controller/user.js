const User = require('../models/user.js');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const transporter = nodemailer.createTransport(
  smtpTransport({
    service: 'Gmail',
    auth: {
      user: 'ducthanhbk1998@gmail.com',
      pass: 'rojvbzqapsmbvozx',
    },
  }),
);
// follow user
module.exports.follow = async (req, res) => {
  try {
    const idFriend = req.params.id;
    const checkUserBlock = await User.findOne({ _id: req.params.id, role: { $ne: 2 } });
    if (!checkUserBlock) {
      return res.status(404).json({ code: 1, message: 'User not found!' });
    }
    const checkExistUser = await User.findOne({ _id: req.user._id, 'following.userId': idFriend });
    if (checkExistUser) {
      return res.status(200).json({ code: 0, message: 'User already followed' });
    }
    const condition1 = { _id: req.user._id };
    const updateFollowing = {
      $push: {
        // update danh sách following của người đi follow
        following: {
          userId: idFriend,
        },
      },
    };
    const condition2 = { _id: idFriend };
    const updateFollower = {
      // update danh sách followers của người được follow
      $push: {
        followers: {
          userId: req.user._id,
        },
      },
    };
    const resFollowing = await User.findByIdAndUpdate(condition1, updateFollowing);
    const resFollower = await User.findByIdAndUpdate(condition2, updateFollower);
    const result = await User.findOne(condition1);
    if (resFollowing && resFollower) {
      return res.status(200).json({ code: 0, message: 'follow success', data: result.following });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};
//unfollow
module.exports.unFollow = async (req, res) => {
  try {
    const idFriend = req.params.id;
    const checkUserBlock = await User.findOne({ _id: req.params.id, role: { $ne: 2 } });
    if (!checkUserBlock) {
      return res.status(404).json({ code: 1, message: 'User not found!' });
    }
    const condition1 = { _id: req.user._id };
    const updateFollowing = {
      $pull: {
        // update danh sách following của người đi follow
        following: {
          userId: idFriend,
        },
      },
    };
    const condition2 = { _id: idFriend };
    const updateFollower = {
      // update danh sách followers của người được follow
      $pull: {
        followers: {
          userId: req.user._id,
        },
      },
    };
    const resFollowing = await User.findByIdAndUpdate(condition1, updateFollowing);
    const resFollower = await User.findByIdAndUpdate(condition2, updateFollower);
    const result = await User.findOne(condition1);
    if (resFollowing && resFollower) {
      return res.status(200).json({
        code: 0,
        message: 'unfollow success',
        data: result.following,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};
// get all followers
module.exports.getAllUserFollower = async (req, res) => {
  try {
    const currentId = req.user._id;
    const user = await User.findOne({ _id: currentId });
    let result = [];
    let listFollower = [];
    if (!user) {
      return res.status(404).json({ code: 1, error: 'User not found' });
    } else {
      listFollower = user.followers;
      for (let i = 0; i < listFollower.length; i++) {
        const userFollowedMe = await User.findOne({ _id: listFollower[i].userId, role: { $ne: 2 } });
        if (userFollowedMe) result.push(userFollowedMe);
      }
    }
    return res.status(200).json({ code: 0, data: result });
  } catch (err) {
    return res.status(500).json({ code: 1, error: 'Server error' });
  }
};
// get all following
module.exports.getAllUserFollowing = async (req, res) => {
  try {
    const currentId = req.user._id;
    const user = await User.findOne({ _id: currentId });
    let result = [];
    let listFollowing = [];
    if (!user) {
      return res.status(404).json({ code: 1, error: 'User not found' });
    } else {
      listFollowing = user.following;
      for (let i = 0; i < listFollowing.length; i++) {
        const userFollowedMe = await User.findOne({ _id: listFollowing[0].userId, role: { $ne: 2 } });
        if (userFollowedMe) result.push(userFollowedMe);
      }
    }
    return res.status(200).json({ code: 0, data: result });
  } catch (error) {
    return res.status(500).json({ code: 1, error: 'Server error' });
  }
};
// change avatar
module.exports.changeAvatar = async (req, res) => {
  try {
    const UrlImg = req.file;
    const currentId = req.user._id;
    const user = await User.findOne({ _id: currentId });
    if (!user) {
      return res.status(404).json({ code: 1, error: 'User not found' });
    }
    const updateAvatar = await User.findOneAndUpdate({ _id: user._id }, { avatar: UrlImg.path });
    if (updateAvatar) {
      return res.status(200).json({ code: 0, message: 'update successfully' });
    }
  } catch (error) {
    return res.status(500).json({ code: 1, error: 'Server error' });
  }
};
// edit profile
module.exports.editProfile = async (req, res) => {
  try {
    const currentId = req.user._id;
    const user = await User.findOne({ _id: currentId });
    if (!user) {
      return res.status(404).json({ code: 1, error: 'User not found' });
    }

    const checkExistsEmail = await User.findOne({ email: req.body.email });
    const checkExistsUserName = await User.findOne({ userName: req.body.userName });
    if (
      (checkExistsEmail && checkExistsEmail.id !== currentId) ||
      (checkExistsUserName && checkExistsUserName.id !== currentId)
    ) {
      return res.status(404).json({ code: 2, error: 'User already exists' });
    }
    const updateProFile = {
      userName: req.body.userName,
      email: req.body.email,
    };
    const updateProFileUser = await User.findOneAndUpdate({ _id: user._id }, updateProFile);
    if (updateProFileUser) {
      const userUpdated = await User.findOne({ _id: currentId });
      return res.status(200).json({ code: 0, data: userUpdated });
    }
  } catch (error) {
    return res.status(500).json({ code: 1, error: 'Server error' });
  }
};
// get all info my profile
module.exports.getMe = async (req, res) => {
  try {
    const currentId = req.user._id;
    const user = await User.findOne({ _id: currentId });
    if (!user) {
      return res.status(404).json({ code: 1, error: 'Can not find user' });
    }
    return res.status(200).json({ code: 0, data: user });
  } catch (error) {
    return res.status(500).json({ code: 1, error: 'Server error' });
  }
};
// get profile of friend
module.exports.getProfileFriend = async (req, res) => {
  try {
    const idFriend = req.params.id;
    const exFriend = await User.findOne({ _id: idFriend });
    if (exFriend.role === null) {
      return res.status(500).json({ code: 1, error: 'role is null' });
    }
    const friend = await User.findOne({ _id: idFriend });
    if (!friend) {
      return res.status(404).json({ code: 1, error: 'User not found' });
    }
    return res.status(200).json({ code: 0, data: friend });
  } catch (err) {
    return res.status(500).json({ code: 1, error: err.message });
  }
};
module.exports.getallUser = async (req, res) => {
  try {
    const listUser = await User.find({});
    if (!listUser) {
      return res.status(404).json({ code: 1, error: 'User not found' });
    }
    return res.status(200).json({ code: 0, data: listUser });
  } catch (err) {
    return res.status(500).json({ code: 1, error: err.message });
  }
};
module.exports.confirmSalePoint = async (req, res) => {
  try {
    const userUpdate = await User.findOneAndUpdate({ _id: req.params.id }, { role: 1 });
    if (userUpdate) {
      return res.status(200).json({ code: 0, message: 'confirm successfully' });
    } else {
      return res.status(400).json({ code: 0, message: 'confirm failed' });
    }
  } catch (err) {
    return res.status(500).json({ code: 1, error: 'Server error' });
  }
};
module.exports.cancelSell = async (req, res) => {
  try {
    const userUpdate = await User.findOneAndUpdate({ _id: req.params.id }, { role: 0 });
    if (userUpdate) {
      return res.status(200).json({ code: 0, message: 'cancel sell successfully' });
    } else {
      return res.status(400).json({ code: 0, message: 'cancel sell failed' });
    }
  } catch (err) {
    return res.status(500).json({ code: 1, error: 'Server error' });
  }
};
module.exports.sendEmail = async (req, res) => {
  try {
    const { email, content } = req.body;
    const mailOptions = {
      from: email,
      to: 'ducthanhbk1998@gmail.com',
      subject: 'Đơn Đăng Ký Điểm Bán',
      text: content,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error:', error.message);
        res.status(500).json({ error: 'Failed to send email.' });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully!' });
      }
    });
  } catch (err) {
    return res.status(500).json({ code: 1, error: err });
  }
};
