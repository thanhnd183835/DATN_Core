const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const esClient = require('../ElasticSearch/elasticsearch');
const endCodeToken = (userID) => {
  return jwt.sign(
    {
      iss: 'ND.Thanh',
      sub: userID,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3),
    },
    JWT_SECRET,
  );
};

module.exports.signInFacebook = async (req, res, next) => {
  const token = endCodeToken(req.user._id);
  // res.setHeader('DATN', token);
  return res.status(200).json({
    success: true,
    data: res.req.user,
  });
};
module.exports.signInGoogle = async (req, res, next) => {
  const token = endCodeToken(req.user._id);
  // res.setHeader('DATN', token);
  return res.status(200).json({ success: true });
};

module.exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    } else if (user.role === 2) {
      return res.status(403).json({
        error: 'Account is block',
      });
    } else {
      const hash_password = user.password;
      const right_pass = await bcrypt.compare(password, hash_password);
      if (!right_pass) {
        return res.status(404).json({
          error: 'Password incorrect',
        });
      } else {
        const token = jwt.sign(
          {
            _id: user._id,
            subDiViSonL: user.subDiViSon,
            following: user.following,
            followers: user.followers,
            posts: user.posts,
            role: user.role,
            notifications: user.notifications,
            authType: user.authType,
            userName: user.userName,
            transaction: user.transaction,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '300d',
          },
        );
        res.cookie('token', token);
        // res.setHeader('DATN', token);
        const {
          _id,
          email,
          role,
          authType,
          avatar,
          subDiViSon,
          following,
          followers,
          firstName,
          lastName,
          notifications,
          posts,
          userName,
          transaction,
        } = user;
        await User.findOneAndUpdate({ email: email }, { active: true });
        return res.status(200).json({
          code: 0,
          data: {
            _id,
            email,
            role,
            authType,
            avatar,
            subDiViSon,
            following,
            followers,
            firstName,
            lastName,
            notifications,
            posts,
            userName,
            transaction,
          },
          token,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
// dang ky
module.exports.signUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName, subDiViSon, userName } = req.body;
    const foundUser = await User.findOne({
      $or: [{ email: email }],
    });
    if (foundUser)
      return res.status(400).json({
        error: { message: 'Email is already in use' },
      });
    else {
      const hash_password = await bcrypt.hash(password, 10);
      const newUser = new User({
        email: email,
        password: hash_password,
        firstName: firstName,
        lastName: lastName,
        subDiViSon: subDiViSon,
        userName: userName,
      });
      newUser.save();
      // await esClient.index({
      //   index: 'datn',
      //   body: newUser,
      // });
      return res.status(200).json({
        code: 0,
        data: newUser,
      });
    }
  } catch (err) {
    return res.status(500).json({
      code: 1,
      error: 'Server error',
    });
  }
};
// logout
module.exports.logout = async (req, res) => {
  try {
    const currentId = req.user._id;
    const user = await User.findOne({ _id: currentId });
    if (!user) {
      return res.status(404).json({ code: 1, error: 'User not found' });
    }
    const logout = await User.findByIdAndUpdate({ _id: currentId }, { active: false });
    if (logout) {
      const userLogout = await User.findOne({ _id: currentId });
      return res.status(200).json({ code: 0, data: userLogout });
    }
  } catch (err) {
    return res.status(500).json({ code: 1, error: err.message });
  }
};

// replace password
module.exports.replacePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    } else {
      const hash_password = user.password;
      const right_pass = await bcrypt.compare(password, hash_password);
      if (!right_pass) {
        return res.status(404).json({
          error: 'Password incorrect',
        });
      } else {
        const decodePass = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ _id: req.user._id }, { password: decodePass });
        return res.status(200).json({
          code: 0,
          message: 'Password changed',
        });
      }
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      error: 'Server error',
    });
  }
};
