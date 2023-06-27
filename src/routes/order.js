const express = require('express');
const router = express.Router();
const controller = require('../controller/order');
const { requireSignIn } = require('../middleware/index');

router.post('/create-order', requireSignIn, controller.createNewOrder);
router.get('/get-order-for-me', requireSignIn, controller.getListOrderBuy);
router.get('/get-order-placed', requireSignIn, controller.getListOrderIsPlaced);
router.post('/agree-item-order', requireSignIn, controller.AgreeOrder);
router.post('/refuse-item-order', requireSignIn, controller.refuseOrder);

module.exports = router;
