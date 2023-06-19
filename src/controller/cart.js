const Cart = require('../models/Cart');
const User = require('../models/user');
// create cart
module.exports.createCart = async (req, res) => {
  try {
    const { UrlImage, name, quantity, price, postId } = req.body;
    const newCart = new Cart({
      UrlImage: UrlImage,
      name: name,
      quantity: quantity,
      price: price,
      postId: postId,
      cartBy: req.user._id,
    });
    const checkPostId = await Cart.findOne({ postId: postId, cartBy: req.user._id });

    if (checkPostId) {
      return res.status(404).json({ error: 'sản phẩm đã được thêm trong giỏ hàng' });
    } else {
      const saveNewCart = await newCart.save();

      if (saveNewCart) {
        await User.findOneAndUpdate({ _id: req.user._id }, { $push: { cart: { cartItemId: newCart._id } } });
        return res.status(201).json({
          code: 0,
          data: saveNewCart,
        });
      } else {
        return res.status(400).json({ error: 'error when user create cart' });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};
//get list cart of user
module.exports.getListCartOfUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const listCart = await Cart.find({ cartBy: userId });
    if (!listCart) {
      return res.status(404).json({ code: 1, error: 'page not found' });
    }
    return res.status(200).json({ code: 0, data: listCart });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};
// total money
module.exports.TotalMoney = async (req, res) => {
  try {
    const { quantity, CartId } = req.body;
    const update = { quantity: quantity };
    const updateQuantity = await Cart.findOneAndUpdate({ _id: CartId }, update, { new: true });
    const newListCart = await Cart.find({ cartBy: req.user._id });
    if (!updateQuantity) {
      return res.status(404).json({ code: 1, error: 'cant not update' });
    }
    return res.status(200).json({ code: 0, data: newListCart });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};
// dele item in Cart
module.exports.DeleteItemCart = async (req, res) => {
  try {
    const idItemCart = req.params.id;
    const userUpdate = await User.findOneAndUpdate(
      { 'cart.cartItemId': idItemCart },
      { $pull: { cart: { cartItemId: idItemCart } } },
    );
    if (!userUpdate) {
      return res.status(404).json({ code: 0, message: 'User Not Found!' });
    }
    const deleteCart = await Cart.findOneAndRemove({ _id: idItemCart });
    if (!deleteCart) {
      return res.status(404).json({ code: 0, message: 'Item Cart Not Found!' });
    }
    if (deleteCart) {
      return res.status(200).json({
        code: 0,
        message: 'Delete Forever Cart success',
      });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};
