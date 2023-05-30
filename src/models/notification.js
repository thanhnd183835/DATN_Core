const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const notificationSchema = new mongoose.Schema(
  {
    userId: {
      // receiver
      type: ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
    post: {
      type: ObjectId,
      ref: 'Post',
    },

    otherUser: {
      type: ObjectId,
      ref: 'User',
    },
    statusNotification: {
      type: String,
      required: true,
      //  not seen
      //  seen
    },
  },
  { timestamps: true },
);

var Notification = mongoose.model('Notification', notificationSchema, 'Notification');
module.exports = Notification;
