const mongoose = require('mongoose');

const userWebsiteSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const paymentSchema = mongoose.Schema({
  OrderID: {
    type: String,
    required: true,
  },
  PaymentID: {
    type: String,
    required: true,
  },
  Signature: {
    type: String,
    required: true,
  },
});

const userSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  avatar_url: {
    type: String,
    required: true,
  },
  isFreeTrial: {
    type: Date,
  },
  isPremium: {
    type: Date,
  },
  premiumType: {
    type: String,
  },
  websites: {
    type: [userWebsiteSchema],
    default: [],
    required: true,
  },
  paymentData: {
    type: [paymentSchema],
    default: [],
  },
});

module.exports = mongoose.model('User', userSchema);
