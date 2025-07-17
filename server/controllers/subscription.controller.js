var Razorpay = require('razorpay');
const crypto = require('crypto');
const { addMonths } = require('date-fns');
const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');

let instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createSubscription = asyncHandler(async (req, res) => {
  const options = {
    amount: req.body.amount * 100,
    currency: req.body.currency,
    receipt: 'TestReciept',
    payment_capture: 1,
  };

  try {
    const response = await instance.orders.create(options);
    res.status(200).json({
      response,
    });
  } catch (error) {
    res.status(500).send('INTERNAL SERVER ERROR');
  }
});

const getPaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await instance.payments.fetch(paymentId);

    if (!payment) {
      return res.status(500).json({ message: 'Payment Failed.' });
    }

    res.json({
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      currency: payment.currency,
    });
  } catch (e) {
    res.status(500).send('INTERNAL SERVER ERROR');
  }
});

const getKey = asyncHandler(async (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
});

const paymentVerification = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, period, itemName } = req.body;

  if (!userId) {
    return res.status(400).json({ message: `userId is not specified` });
  }

  const user = await User.findOne({ userId });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_TEST_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;
  if (isAuthentic) {
    user.paymentData.push({
      PaymentID: razorpay_payment_id,
      OrderID: razorpay_order_id,
      Signature: razorpay_signature,
    });
    user.premiumType = itemName;

    let monthsToAdd = 0;
    switch (period) {
      case 'monthly':
        monthsToAdd = 1;
        break;
      case 'quarterly':
        monthsToAdd = 3;
        break;
      case 'halfYearly':
        monthsToAdd = 6;
        break;
      case 'yearly':
        monthsToAdd = 12;
        break;
      default:
        return res.status(400).json({ message: 'Invalid period' });
    }

    if (user.isPremium) {
      user.isPremium = addMonths(new Date(user.isPremium), monthsToAdd);
    } else {
      user.isPremium = addMonths(new Date(), monthsToAdd);
    }

    await user.save();

    return res.status(200).json({ success: true });
  } else {
    return res.status(400).json({ success: false });
  }
});

module.exports = {
  getKey,
  paymentVerification,
  getPaymentStatus,
  createSubscription,
};
