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
    // dùng để update trạng thái đơn hàng
    statusCart: {
      type: Number,
      default: 0,
      enum: [
        0, // chờ xác nhận
        1, // đồng ý
        2, // từ chối
      ],
    },
    orderId: { type: String },
    cartBy: { type: ObjectId, ref: 'User' },
    postBy: { type: Object },
    postId: { type: ObjectId, ref: 'Post' },
  },

  { timestamps: true },
);
var Cart = mongoose.model('Cart', userSchema, 'Cart');
module.exports = Cart;
