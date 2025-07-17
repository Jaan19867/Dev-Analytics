const express = require('express');
const { newEvent, endEvent } = require('../controllers/event.controller');
const router = express.Router();

router.post('/newEvent', newEvent);
router.post('/endEvent', endEvent);

module.exports = router;
