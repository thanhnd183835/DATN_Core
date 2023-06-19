const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // ten sp
    },
    UrlImg: {
      type: String,
      required: true,
      // anh minh hoa
    },
    price: {
      type: Number,
      require: true,
      // gia san pham
    },
    typeItem: {
      type: String,
      require: true,
      // loai sp
    },
    description: {
      type: String,
      require: true,
    },
    detailItem: {
      type: String,
      require: true,
      // chi tiet sp
    },
    comments: [
      {
        userId: { type: ObjectId, ref: 'User' },
        content: { type: String },
      },
    ],
    likes: [
      {
        userId: { type: ObjectId, ref: 'User' },
      },
    ],
    postBy: { type: ObjectId, ref: 'User' },
    statusPost: {
      type: String,
      default: 'active',
    },
  },

  { timestamps: true },
);
var Post = mongoose.model('Post', userSchema, 'Post');
module.exports = Post;
