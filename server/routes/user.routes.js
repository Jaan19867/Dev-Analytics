const express = require('express');
const { getAccessToken, getUserData } = require('../controllers/user.controller');
const router = express.Router();

router.get('/getAccessToken', getAccessToken);
router.get('/getUserData', getUserData);

module.exports = router;
