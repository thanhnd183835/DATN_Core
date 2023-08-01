const Message = require('../models/message.js');
const ChatRoom = require('../models/chatRoom.js');
const User = require('../models/user.js');
const shortid = require('shortid');

// add message to chat room. Only chat two persons, not room is have more than 2 peoples
module.exports.addMessage = async (req, res) => {
  try {
    const currentId = req.user._id;
    const UrlImg = req.file;

    const user1 = await User.findOne({ _id: currentId, role: { $ne: 2 } });
    const user2 = await User.findOne({ _id: req.body.receiver, role: { $ne: 2 } });

    if (!user1 || !user2) {
      return res.status(404).json({ message: 'User not found or this account was blocked' });
    }

    const users = [currentId, req.body.receiver];
    const findChatRoom = await Message.findOne({
      $or: [
        { sender: users[0], receiver: users[1] },
        { sender: users[1], receiver: users[0] },
      ],
    });
    if (!findChatRoom) {
      const nameRoom = shortid.generate();
      const _newChatRoom = new ChatRoom({
        name: nameRoom,
        listMessage: [],
        users: [{ user: users[0] }, { user: users[1] }],
      });

      const saveChatRoom = await _newChatRoom.save();

      if (saveChatRoom) {
        const _message = new Message({
          chatRoom: saveChatRoom._id,
          sender: currentId,
          receiver: req.body.receiver,
          content: req.body.content,
          image: UrlImg ? UrlImg.path : '',
        });

        const saveMessage = await _message.save();

        if (saveMessage) {
          await ChatRoom.findOneAndUpdate(
            { _id: saveChatRoom._id },
            {
              $push: {
                listMessage: { message: saveMessage._id },
              },
            },
          );
          return res.status(200).json({ code: 0, data: saveMessage });
        }
      }
    } else {
      const _message = new Message({
        chatRoom: findChatRoom.chatRoom,
        sender: currentId,
        receiver: req.body.receiver,
        content: req.body.content,
        image: UrlImg ? UrlImg.path : '',
      });

      const saveMessage = await _message.save();

      if (saveMessage) {
        await ChatRoom.findOneAndUpdate(
          { _id: findChatRoom.chatRoom },
          {
            $push: {
              listMessage: { message: saveMessage._id },
            },
          },
        );
        return res.status(200).json({
          code: 0,
          data: saveMessage,
        });
      }
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// get list messages in chat room(room include 2 persons)
module.exports.getListMessage = async (req, res) => {
  try {
    const currentId = req.user._id;
    const user = await User.findOne({ _id: currentId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const users = [currentId, req.params.idReceiver];
    const findChatRoom = await Message.find({
      $or: [
        { sender: users[0], receiver: users[1] },
        { sender: users[1], receiver: users[0] },
      ],
    });
    if (!findChatRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }
    return res.status(200).json({ code: 0, data: { room: findChatRoom } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// get all chat room have this user
module.exports.getChatRoom = async (req, res) => {
  try {
    const currentId = req.user._id;
    const user = await User.findOne({ _id: currentId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // find all chat rooms by user_id
    const rooms = await ChatRoom.find({
      $or: [{ 'users.user': user._id }, { 'users.user': user._id }],
    }).populate({
      path: 'users',
      populate: { path: 'user', select: ['userName', 'avatar', 'active', 'updatedAt', 'role'] },
    });

    if (!rooms) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.status(200).json({ code: 0, data: rooms });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
