const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const messageSchema = new mongoose.Schema(
  {
    chatRoom: { type: ObjectId, ref: 'ChatRoom' },
    sender: {
      type: ObjectId,
      ref: 'User',
    },
    receiver: {
      type: ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },

    // createAt: Date,
  },
  { timestamps: true },
);

var Message = mongoose.model('Message', messageSchema, 'Message');
module.exports = Message;
