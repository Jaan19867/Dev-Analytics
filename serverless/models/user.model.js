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
  websites: {
    type: [userWebsiteSchema],
    default: [],
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
