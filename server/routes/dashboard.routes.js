const express = require('express');
const { addWebsite, removeWebsite } = require('../controllers/dashboard.controller');
const router = express.Router();

router.post('/addWebsite', addWebsite);
router.post('/removeWebsite', removeWebsite);

module.exports = router;
