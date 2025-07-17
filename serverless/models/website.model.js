const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
  visit_id: {
    type: String,
    required: true,
    unique: true,
  },
  path: {
    type: String,
    required: true,
  },
  unique_visitor: {
    type: Boolean,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  referrers: {
    type: String,
    required: true,
  },
  device: {
    type: String,
    required: true,
  },
  operatingsystem: {
    type: String,
    required: true,
  },
  browser: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  timespent: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const websiteSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  hostname: {
    type: String,
    required: [true, 'Host name is required'],
  },
  events: {
    type: [eventsSchema],
    default: [],
  },
});

module.exports = mongoose.model('Website', websiteSchema);
