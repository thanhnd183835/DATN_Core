const express = require('express');
const router = express.Router();
const { requireSignIn } = require('../middleware');
const controller = require('../controller/transaction');

router.post('/create_payment_url', requireSignIn, controller.createPayment);
// router.get('/vnpay_return', requireSignIn, controller.vnpay_return);
router.get('/vnpay_ipn', controller.vnpayIpn);

module.exports = router;
