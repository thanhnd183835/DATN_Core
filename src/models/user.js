const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    userName: {
      type: String,
      require: true,
    },
    authGoogleID: {
      type: String,
      default: null,
    },
    authFacebookID: {
      type: String,
      default: null,
    },
    authType: {
      type: String,
      enum: ['local', 'google', 'facebook'],
      default: 'local',
    },
    avatar: {
      type: String,
      default: 'https://res.cloudinary.com/dzjtdpc4h/image/upload/v1685695781/DATN/default-avatar_fmsxmp.png',
    },
    subDiViSon: {
      type: String,
      require: true,
    },
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    followers: [{ userId: { type: ObjectId, ref: 'User' } }], // người theo dõi mình
    following: [{ userId: { type: ObjectId, ref: 'User' } }], // người mình đang theo dõi
    notifications: [{ notificationId: { type: ObjectId, ref: 'Notification' } }],
    posts: [{ postId: { type: ObjectId, ref: 'Post' } }],
    cart: [{ cartItemId: { type: ObjectId, ref: 'Cart' } }],
    order: [{ oderId: { type: ObjectId, ref: 'Order' } }],
    transaction: [{ transactionId: { type: ObjectId, ref: 'Transaction' } }],
    role: {
      type: Number,
      default: 0,
      enum: [
        0, // nguoi dung bth
        1, // nguoi ban hang
        2, // tk bi khoa
      ],
    },
    active: {
      type: Boolean,
      default: false,
    },

    createAt: Date,
  },
  { timestamps: true },
);
var User = mongoose.model('User', userSchema, 'User');
module.exports = User;
