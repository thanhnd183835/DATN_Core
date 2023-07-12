const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const TransactionSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  amount: {
    // so tien
    type: Number,
    required: true,
  },
  orderInfo: {
    // thong tin giao dich
    type: String,
    required: true,
  },
  orderType: {
    // ma hh
    type: Number,
    required: true,
  },
  bankCode: {
    type: String,
  },
  TransactionStatus: {
    type: Number,
    default: 0,
    enum: [
      0, // mac dinh chưa thanh toán
      1, //thanh cong
      2, // that bai
    ],
  },
  transactionBy: { type: ObjectId, ref: 'User' },
});

var Transaction = mongoose.model('Transaction', TransactionSchema, 'Transaction');
module.exports = Transaction;
