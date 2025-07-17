const express = require('express');
const {
  getKey,
  paymentVerification,
  getPaymentStatus,
  createSubscription,
} = require('../controllers/subscription.controller');
const router = express.Router();

router.get('/getKey', getKey);
router.get('/getPaymentStatus/:paymentId', getPaymentStatus);

router.post('/paymentVerification', paymentVerification);
router.post('/createSubscription', createSubscription);

module.exports = router;
