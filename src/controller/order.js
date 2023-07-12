const Order = require('../models/Order');
const User = require('../models/user');

module.exports.createNewOrder = async (req, res) => {
  try {
    const { phoneNumber, address, totalMoney, order } = req.body;
    const newOrder = new Order({
      phoneNumber: phoneNumber,
      address: address,
      totalMoney: totalMoney,
      order: order,
      orderBy: req.user._id,
    });
    newOrder.order.forEach((cart) => {
      cart.orderId = newOrder._id.toString();
    });
    const saveNewOrder = await newOrder.save();

    if (saveNewOrder) {
      await User.findOneAndUpdate({ _id: req.user._id }, { $push: { order: { orderId: newOrder._id } } });
      saveNewOrder.order[0].orderId;
      return res.status(201).json({
        code: 0,
        data: saveNewOrder,
      });
    } else {
      return res.status(400).json({ error: 'error when user create order' });
    }
  } catch (error) {
    return res.status(500).json({
      code: 1,
      error: error,
    });
  }
};
// get list sp đã đặt
module.exports.getListOrderBuy = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not find' });
    }
    const getListOrderBy = await Order.find({ orderBy: userId });
    if (!getListOrderBy) {
      return res.status(404).json({ message: 'Not find order' });
    }
    return res.status(200).json({ code: 0, data: getListOrderBy });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};
// lấy danh sách sản phẩm của người bán đã được user khác đặt
module.exports.getListOrderIsPlaced = async (req, res) => {
  try {
    const listOrder = await Order.find({});
    const listPostInOrder = listOrder.map((item) => item.order).flat();
    const listPostOfUser = listPostInOrder.filter((item) => item.postBy === req.user._id);
    if (!listPostOfUser) {
      return res.status(404).json({ message: 'Not find order' });
    }
    return res.status(200).json({ code: 0, data: listPostOfUser });
  } catch (error) {
    return res.status(500).json({
      code: 1,
      error: error,
    });
  }
};
module.exports.AgreeOrder = async (req, res) => {
  try {
    const { idOrder, idItemCart } = req.body;
    const updateStatusOrder = await Order.updateOne(
      { _id: idOrder, 'order._id': idItemCart },
      { $set: { 'order.$.statusCart': 1 } },
    );
    if (!updateStatusOrder) {
      return res.status(404).json({ code: 1, error: 'order not found' });
    } else {
      return res.status(200).json({ message: 'agree order' });
    }
  } catch (error) {
    return res.status(500).json({
      code: 1,
      error: error,
    });
  }
};
module.exports.refuseOrder = async (req, res) => {
  try {
    const { idOrder, idItemCart } = req.body;
    const updateStatusOrder = await Order.updateOne(
      { _id: idOrder, 'order._id': idItemCart },
      { $set: { 'order.$.statusCart': 2 } },
    );
    if (!updateStatusOrder) {
      return res.status(404).json({ code: 1, error: 'order not found' });
    } else {
      return res.status(200).json({ message: 'refuse order' });
    }
  } catch (error) {
    return res.status(500).json({
      code: 1,
      error: error,
    });
  }
};
module.exports.getOrderById = async (req, res) => {
  try {
    const idOrder = req.params.id;
    const order = await Order.findOne({ _id: idOrder });
    if (!order) {
      return res.status(404).json({ code: 1, error: 'order not found' });
    }
    return res.status(200).json({ code: 0, data: order });
  } catch (error) {
    return res.status(500).json({
      code: 1,
      error: error,
    });
  }
};
