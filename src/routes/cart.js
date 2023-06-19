const express = require('express');
const router = express.Router();
const controller = require('../controller/cart');
const { requireSignIn } = require('../middleware/index');

router.post('/add-cart', requireSignIn, controller.createCart);
router.get('/get-list-cart', requireSignIn, controller.getListCartOfUser);
router.post('/update-quantity', requireSignIn, controller.TotalMoney);
router.post('/delete-cart/:id', requireSignIn, controller.DeleteItemCart);
module.exports = router;
