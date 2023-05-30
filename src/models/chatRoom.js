const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const chatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    listMessage: [
      {
        message: {
          type: ObjectId,
          ref: 'Message',
        },
      },
    ],
    users: [{ user: { type: ObjectId, ref: 'User' } }],

    // createAt: Date,
  },
  { timestamps: true },
);

var ChatRoom = mongoose.model('ChatRoom', chatRoomSchema, 'ChatRoom');
module.exports = ChatRoom;
