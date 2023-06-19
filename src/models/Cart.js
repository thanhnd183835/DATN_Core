const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // ten sp
    },
    UrlImage: {
      type: String,
      required: true,
      // anh minh hoa
    },
    price: {
      type: Number,
      require: true,
      // gia san pham
    },
    // so luong
    quantity: {
      default: 1,
      type: Number,
      require: true,
    },
    cartBy: { type: ObjectId, ref: 'User' },
    postId: { type: ObjectId, ref: 'Post' },
  },

  { timestamps: true },
);
var Cart = mongoose.model('Cart', userSchema, 'Cart');
module.exports = Cart;
