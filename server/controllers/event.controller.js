const asyncHandler = require('express-async-handler');
const Website = require('../models/website.model');
const { UAParser } = require('ua-parser-js');
const ct = require('countries-and-timezones');
const { decrypt } = require('../utils/encrypt');
const { private_key, users, addHashmap } = require('../server');

// Body has single digit variables to decrease the package binary size
const newEvent = asyncHandler(async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'];
    const acceptLanguage = req.headers['accept-language'];

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Unauthorized access attempt');
      return;
    }

    const api_key = authHeader.split(' ')[1];
    const user_id = decrypt(api_key.toString(), private_key).split(':')[0];

    console.log('ID FROM API KEY ::: ', user_id);
    const { i, v, r, t, p, u, k } = req.body;

    console.log(req.body);
    if (!i || v === undefined || !p || !u || k === undefined) {
      console.error('Missing required fields');
      return;
    }

    let url;
    try {
      url = new URL(p);
    } catch (error) {
      console.error('Invalid URL provided');
      return;
    }

    const user_in_hashmap = users.get(u);
    console.log('User In Hashmap ::: ', user_in_hashmap);
    if (user_in_hashmap === undefined) {
      addHashmap(u, user_id);
    } else if (user_in_hashmap.value !== user_id) {
      console.error('Forbidden access');
      return;
    }

    const website = await Website.findOne({ id: u });
    if (!website) {
      console.error('Website not found');
      return;
    }

    const agentResult = new UAParser(userAgent).getResult();
    const country = ct.getCountryForTimezone(t)?.name || 'Unknown';

    const browser = agentResult.browser.name || 'Unknown';
    const os = agentResult.os.name || 'Unknown';
    const osVersion = agentResult.os.version || 'Unknown';
    const device = agentResult.device.model || 'Unknown';

    website.events.push({
      visit_id: i,
      unique_visitor: v,
      path: url.pathname,
      timespent: 0,
      device,
      visit: k,
      referrers: r || 'Direct',
      operatingsystem: `${os} ${osVersion}`,
      browser,
      country,
      language: (acceptLanguage?.split(',')[0] || 'Unknown').split(';')[0],
    });

    await website.save();
  } catch (error) {
    console.error('Error handling new event:', error);
  }
});

const endEvent = asyncHandler(async (req, res) => {
  // i -> visit_id
  // m -> timespent
  // u -> website's unique id
  const body = JSON.parse(req.body);
  const { i, m, u } = body;

  const website = await Website.findOne({ id: u });
  const event = website.events.find((event) => event.visit_id === i);
  event.timespent = m;
  await website.save();
});

module.exports = { newEvent, endEvent };
