const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      // ten sp
    },
    address: {
      type: String,
      required: true,
      // anh minh hoa
    },
    totalMoney: {
      type: Number,
      require: true,
      // gia san pham
    },

    order: {},
    orderBy: { type: ObjectId, ref: 'User' },
    paymentStatus: {
      type: Number,
      default: 0,
      enum: [
        0, // mac dinh chưa thanh toán
        1, //đã thanh toán
        2, // chưa thanh toán
      ],
    },
  },

  { timestamps: true },
);
var Order = mongoose.model('Order', userSchema, 'Order');
module.exports = Order;
