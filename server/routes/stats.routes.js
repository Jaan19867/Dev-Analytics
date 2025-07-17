const express = require('express');
const {
  devices,
  countries,
  languages,
  os,
  browsers,
  referrers,
  paths,
  summary,
} = require('../controllers/stats.controller');
const router = express.Router();

router.get('/:id/devices', devices);
router.get('/:id/countries', countries);
router.get('/:id/languages', languages);
router.get('/:id/os', os);
router.get('/:id/browsers', browsers);
router.get('/:id/referrers', referrers);
router.get('/:id/pages', paths);
router.get('/:id/summary', summary);

module.exports = router;
