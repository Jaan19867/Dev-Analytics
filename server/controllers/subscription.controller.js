const crypto = require('crypto');
const { addMonths } = require('date-fns');
const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');

// Removed Razorpay - everything is free now

const createSubscription = asyncHandler(async (req, res) => {
  // Free subscription - no payment required
  res.status(200).json({
    message: 'Free subscription activated',
    response: {
      id: 'free_subscription_' + Date.now(),
      amount: 0,
      currency: 'INR',
      status: 'created'
    }
  });
});

const getPaymentStatus = asyncHandler(async (req, res) => {
  // Always return success for free subscriptions
  res.json({
    status: 'captured',
    method: 'free',
    amount: 0,
    currency: 'INR',
  });
});

const getKey = asyncHandler(async (req, res) => {
  // Return a dummy key for free subscriptions
  res.status(200).json({ key: 'free_key' });
});

const paymentVerification = asyncHandler(async (req, res) => {
  const { userId, period, itemName } = req.body;

  if (!userId) {
    return res.status(400).json({ message: `userId is not specified` });
  }

  const user = await User.findOne({ userId });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Free subscription - no payment verification needed
  user.paymentData.push({
    PaymentID: 'free_payment_' + Date.now(),
    OrderID: 'free_order_' + Date.now(),
    Signature: 'free_signature',
  });
  user.premiumType = itemName || 'Free';

  // For free plan, give a very long subscription (10 years)
  let monthsToAdd = 120; // 10 years for free plan
  
  // Keep the period logic for future flexibility
  switch (period) {
    case 'monthly':
      monthsToAdd = 120; // Still 10 years for free
      break;
    case 'quarterly':
      monthsToAdd = 120; // Still 10 years for free
      break;
    case 'halfYearly':
      monthsToAdd = 120; // Still 10 years for free
      break;
    case 'yearly':
      monthsToAdd = 120; // 10 years for free
      break;
    default:
      monthsToAdd = 120; // Default to 10 years for free
  }

  if (user.isPremium) {
    user.isPremium = addMonths(new Date(user.isPremium), monthsToAdd);
  } else {
    user.isPremium = addMonths(new Date(), monthsToAdd);
  }

  await user.save();

  return res.status(200).json({ 
    success: true, 
    message: 'Free plan activated successfully! Enjoy unlimited access to all features.' 
  });
});

module.exports = {
  getKey,
  paymentVerification,
  getPaymentStatus,
  createSubscription,
};
