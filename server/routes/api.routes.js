const express = require('express');
const { getApiKey } = require('../controllers/api.controller');
const router = express.Router();

router.post('/getApiKey', getApiKey);

module.exports = router;
