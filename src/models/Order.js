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
  },

  { timestamps: true },
);
var Order = mongoose.model('Order', userSchema, 'Order');
module.exports = Order;
