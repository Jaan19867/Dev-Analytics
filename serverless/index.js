const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const User = require('./models/user.model');
const Website = require('./models/website.model');
const { getDateRange } = require('../utils/statUtils');
const { UAParser } = require('ua-parser-js');
const ct = require('countries-and-timezones');

module.exports.addWebsite = async (event, context, cb) => {
  const { userId, website, description, id } = JSON.parse(event.body);
  if (!userId || !website) {
    res.status(400);
    throw new Error('User ID and website URL are required');
  }

  const user = await User.findOne({ userId });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!user.websites.some((site) => site.website === website)) {
    const addSite = new Website({ id, hostname: website });
    await addSite.save();

    user.websites.push({ id, website, description });
    await user.save();
  } else {
    return res.status(400).json({ message: `You already have ${website} registered.` });
  }
  return res.status(200).json({ message: 'Website added', websites: user.websites });
};

module.exports.removeWebsite = async (event, context, cb) => {
  const { userId, id } = JSON.parse(event.body);
  if (!userId || !id) {
    res.status(400);
    throw new Error('User ID and website URL are required');
  }

  const user = await User.findOne({ userId });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.websites = user.websites.filter((site) => site.id !== id);
  await user.save();

  await Website.deleteOne({ id });
  res.status(200).json({ message: 'Website removed', websites: user.websites });
};

module.exports.newEvent = async (event, context, cb) => {
  const userAgent = event.headers['user-agent'];
  const acceptLanguage = event['accept-language'];
  // i -> visit_id
  // v -> unique_visitor
  // r -> referrers
  // t -> timezone
  // p -> path
  // u -> website's unique id
  const { i, v, r, t, p, u } = JSON.parse(event.body);
  const url = new URL(p);

  const website = await Website.findOne({ id: u });
  if (!website) return;

  const agentResult = new UAParser(userAgent).getResult();
  const country = ct.getCountryForTimezone(t).name;

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
    referrers: r ? r : 'Direct',
    operatingsystem: `${os} ${osVersion}`,
    browser,
    country,
    language: acceptLanguage.split(',')[0].split(';')[0],
  });

  await website.save();
};

module.exports.endEvent = async (event, context, cb) => {
  // i -> visit_id
  // m -> timespent
  // u -> website's unique id
  const body = JSON.parse(event.body);
};

module.exports.browsers = async (event, context, cb) => {
  try {
    const pathParams = event.pathParameters || {};
    const queryParams = event.queryStringParameters || {};
    const id = pathParams.id;
    const period = queryParams.period;

    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    const { startDate, endDate } = getDateRange(period);

    const results = await Website.aggregate([
      { $match: { id } },
      { $unwind: '$events' },
      { $match: { 'events.timestamp': { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$events.browser',
          uniqueVisitors: { $sum: { $cond: ['$events.unique_visitor', 1, 0] } },
          totalEvents: { $sum: 1 },
          totalTimeSpent: { $sum: '$events.timespent' },
          eventsWithTimeSpent: { $sum: { $cond: [{ $ne: ['$events.timespent', 0] }, 1, 0] } },
          bounces: {
            $sum: {
              $cond: [{ $and: [{ $lt: ['$events.timespent', 6] }, '$events.unique_visitor'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          browser: '$_id',
          uniqueVisitors: '$uniqueVisitors',
          bounceRate: {
            $cond: [{ $eq: ['$eventsWithTimeSpent', 0] }, 0, { $divide: ['$bounces', '$eventsWithTimeSpent'] }],
          },
          averageTimeSpent: {
            $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
          },
        },
      },
    ]);

    const totalUniqueVisitors = results.reduce((sum, item) => sum + item.uniqueVisitors, 0);
    const final_results = results.map((item) => ({
      ...item,
      visitorPercentage: totalUniqueVisitors > 0 ? (item.uniqueVisitors / totalUniqueVisitors) * 100 : 0,
    }));

    res.status(200).json(final_results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.countries = async (event, context, cb) => {
  try {
    const pathParams = event.pathParameters || {};
    const queryParams = event.queryStringParameters || {};
    const id = pathParams.id;
    const period = queryParams.period;
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    const { startDate, endDate } = getDateRange(period);

    const results = await Website.aggregate([
      { $match: { id } },
      { $unwind: '$events' },
      { $match: { 'events.timestamp': { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$events.country',
          uniqueVisitors: { $sum: { $cond: ['$events.unique_visitor', 1, 0] } },
          totalTimeSpent: { $sum: '$events.timespent' },
          totalEvents: { $sum: 1 },
          eventsWithTimeSpent: {
            $sum: {
              $cond: [{ $ne: ['$events.timespent', 0] }, 1, 0],
            },
          },
          bounces: {
            $sum: {
              $cond: [{ $and: [{ $lt: ['$events.timespent', 6] }, '$events.unique_visitor'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          country: '$_id',
          uniqueVisitors: '$uniqueVisitors',
          bounceRate: {
            $cond: [{ $eq: ['$eventsWithTimeSpent', 0] }, 0, { $divide: ['$bounces', '$eventsWithTimeSpent'] }],
          },
          averageTimeSpent: {
            $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
          },
        },
      },
    ]);

    const totalUniqueVisitors = results.reduce((sum, item) => sum + item.uniqueVisitors, 0);
    const final_results = results.map((item) => ({
      ...item,
      visitorPercentage: (item.uniqueVisitors / totalUniqueVisitors) * 100,
    }));

    res.status(200).json(final_results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.languages = async (event, context, cb) => {
  try {
    const pathParams = event.pathParameters || {};
    const queryParams = event.queryStringParameters || {};
    const id = pathParams.id;
    const period = queryParams.period;
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    const { startDate, endDate } = getDateRange(period);
    const results = await Website.aggregate([
      { $match: { id } },
      { $unwind: '$events' },
      { $match: { 'events.timestamp': { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$events.language',
          uniqueVisitors: { $sum: { $cond: ['$events.unique_visitor', 1, 0] } },
          totalTimeSpent: { $sum: '$events.timespent' },
          totalEvents: { $sum: 1 },
          eventsWithTimeSpent: {
            $sum: {
              $cond: [{ $ne: ['$events.timespent', 0] }, 1, 0],
            },
          },
          bounces: {
            $sum: {
              $cond: [{ $and: [{ $lt: ['$events.timespent', 6] }, '$events.unique_visitor'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          language: '$_id',
          uniqueVisitors: '$uniqueVisitors',
          bounceRate: {
            $cond: [{ $eq: ['$eventsWithTimeSpent', 0] }, 0, { $divide: ['$bounces', '$eventsWithTimeSpent'] }],
          },
          averageTimeSpent: {
            $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
          },
        },
      },
    ]);

    const totalUniqueVisitors = results.reduce((sum, item) => sum + item.uniqueVisitors, 0);
    const final_results = results.map((item) => ({
      ...item,
      visitorPercentage: (item.uniqueVisitors / totalUniqueVisitors) * 100,
    }));

    res.status(200).json(final_results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.os = async (event, context, cb) => {
  try {
    const pathParams = event.pathParameters || {};
    const queryParams = event.queryStringParameters || {};
    const id = pathParams.id;
    const period = queryParams.period;
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    const { startDate, endDate } = getDateRange(period);
    const results = await Website.aggregate([
      { $match: { id } },
      { $unwind: '$events' },
      { $match: { 'events.timestamp': { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$events.operatingsystem',
          uniqueVisitors: { $sum: { $cond: ['$events.unique_visitor', 1, 0] } },
          totalTimeSpent: { $sum: '$events.timespent' },
          totalEvents: { $sum: 1 },
          eventsWithTimeSpent: {
            $sum: {
              $cond: [{ $ne: ['$events.timespent', 0] }, 1, 0],
            },
          },
          bounces: {
            $sum: {
              $cond: [{ $and: [{ $lt: ['$events.timespent', 6] }, '$events.unique_visitor'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          operatingsystem: '$_id',
          uniqueVisitors: '$uniqueVisitors',
          bounceRate: {
            $cond: [{ $eq: ['$eventsWithTimeSpent', 0] }, 0, { $divide: ['$bounces', '$eventsWithTimeSpent'] }],
          },
          averageTimeSpent: {
            $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
          },
        },
      },
    ]);

    const totalUniqueVisitors = results.reduce((sum, item) => sum + item.uniqueVisitors, 0);
    const final_results = results.map((item) => ({
      ...item,
      visitorPercentage: (item.uniqueVisitors / totalUniqueVisitors) * 100,
    }));

    res.status(200).json(final_results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.devices = async (event, context, cb) => {
  try {
    const pathParams = event.pathParameters || {};
    const queryParams = event.queryStringParameters || {};
    const id = pathParams.id;
    const period = queryParams.period;
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    const { startDate, endDate } = getDateRange(period);

    const results = await Website.aggregate([
      { $match: { id } },
      { $unwind: '$events' },
      { $match: { 'events.timestamp': { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$events.device',
          uniqueVisitors: { $sum: { $cond: ['$events.unique_visitor', 1, 0] } },
          totalTimeSpent: { $sum: '$events.timespent' },
          totalEvents: { $sum: 1 },
          eventsWithTimeSpent: {
            $sum: {
              $cond: [{ $ne: ['$events.timespent', 0] }, 1, 0],
            },
          },
          bounces: {
            $sum: {
              $cond: [{ $and: [{ $lt: ['$events.timespent', 6] }, '$events.unique_visitor'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          device: '$_id',
          uniqueVisitors: '$uniqueVisitors',
          bounceRate: {
            $cond: [{ $eq: ['$eventsWithTimeSpent', 0] }, 0, { $divide: ['$bounces', '$eventsWithTimeSpent'] }],
          },
          averageTimeSpent: {
            $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
          },
        },
      },
    ]);

    const totalUniqueVisitors = results.reduce((sum, item) => sum + item.uniqueVisitors, 0);
    const final_results = results.map((item) => ({
      ...item,
      visitorPercentage: (item.uniqueVisitors / totalUniqueVisitors) * 100,
    }));

    res.status(200).json(final_results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.referrers = async (event, context, cb) => {
  try {
    const pathParams = event.pathParameters || {};
    const queryParams = event.queryStringParameters || {};
    const id = pathParams.id;
    const period = queryParams.period;
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    const { startDate, endDate } = getDateRange(period);
    const results = await Website.aggregate([
      { $match: { id } },
      { $unwind: '$events' },
      { $match: { 'events.timestamp': { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$events.referrers',
          uniqueVisitors: { $sum: { $cond: ['$events.unique_visitor', 1, 0] } },
          totalTimeSpent: { $sum: '$events.timespent' },
          totalEvents: { $sum: 1 },
          eventsWithTimeSpent: {
            $sum: {
              $cond: [{ $ne: ['$events.timespent', 0] }, 1, 0],
            },
          },
          bounces: {
            $sum: {
              $cond: [{ $and: [{ $lt: ['$events.timespent', 6] }, '$events.unique_visitor'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          referrers: '$_id',
          uniqueVisitors: '$uniqueVisitors',
          bounceRate: {
            $cond: [{ $eq: ['$eventsWithTimeSpent', 0] }, 0, { $divide: ['$bounces', '$eventsWithTimeSpent'] }],
          },
          averageTimeSpent: {
            $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
          },
        },
      },
    ]);

    const totalUniqueVisitors = results.reduce((sum, item) => sum + item.uniqueVisitors, 0);
    const final_results = results.map((item) => ({
      ...item,
      visitorPercentage: (item.uniqueVisitors / totalUniqueVisitors) * 100,
    }));

    res.status(200).json(final_results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.paths = async (event, context, cb) => {
  try {
    const pathParams = event.pathParameters || {};
    const queryParams = event.queryStringParameters || {};
    const id = pathParams.id;
    const period = queryParams.period;
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    const { startDate, endDate } = getDateRange(period);
    const results = await Website.aggregate([
      { $match: { id } },
      { $unwind: '$events' },
      { $match: { 'events.timestamp': { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$events.path',
          uniqueVisitors: { $sum: { $cond: ['$events.unique_visitor', 1, 0] } },
          totalTimeSpent: { $sum: '$events.timespent' },
          totalEvents: { $sum: 1 },
          eventsWithTimeSpent: {
            $sum: {
              $cond: [{ $ne: ['$events.timespent', 0] }, 1, 0],
            },
          },
          bounces: {
            $sum: {
              $cond: [{ $and: [{ $lt: ['$events.timespent', 6] }, '$events.unique_visitor'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          path: '$_id',
          uniqueVisitors: '$uniqueVisitors',
          totalEvents: '$totalEvents',
          totalTime: '$totalTimeSpent',
          bounceRate: {
            $cond: [{ $eq: ['$eventsWithTimeSpent', 0] }, 0, { $divide: ['$bounces', '$eventsWithTimeSpent'] }],
          },
          averageTimeSpent: {
            $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
          },
        },
      },
    ]);

    const totalUniqueVisitors = results.reduce((sum, item) => sum + item.uniqueVisitors, 0);
    const allEvents = results.reduce((sum, item) => sum + item.totalEvents, 0);

    const final_results = results.map((item) => ({
      ...item,
      visitorPercentage: totalUniqueVisitors > 0 ? (item.uniqueVisitors / totalUniqueVisitors) * 100 : 0,
      eventPercentage: allEvents > 0 ? (item.totalEvents / allEvents) * 100 : 0,
    }));

    res.status(200).json(final_results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.summary = async (event, context, cb) => {
  try {
    const pathParams = event.pathParameters || {};
    const queryParams = event.queryStringParameters || {};
    const id = pathParams.id;
    const period = queryParams.period;
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    const { startDate, endDate, interval, intervalUnit, previousEndDate, previousStartDate } = getDateRange(period);

    const current_results = await Website.aggregate([
      { $match: { id } },
      { $unwind: '$events' },
      { $match: { 'events.timestamp': { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: null,
          uniqueVisitors: {
            $sum: {
              $cond: ['$events.unique_visitor', 1, 0],
            },
          },
          totalEvents: { $sum: 1 },
          bounces: {
            $sum: {
              $cond: [{ $and: [{ $lt: ['$events.timespent', 6] }, '$events.unique_visitor'] }, 1, 0],
            },
          },
          eventsWithTimeSpent: {
            $sum: {
              $cond: [{ $ne: ['$events.timespent', 0] }, 1, 0],
            },
          },
          totalTimeSpent: { $sum: '$events.timespent' },
        },
      },
      {
        $project: {
          _id: 0,
          uniqueVisitors: '$uniqueVisitors',
          totalEvents: '$totalEvents',
          bounceRate: {
            $cond: [{ $eq: ['$eventsWithTimeSpent', 0] }, 0, { $divide: ['$bounces', '$eventsWithTimeSpent'] }],
          },
          averageTimeSpent: {
            $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
          },
        },
      },
    ]);

    const previous_results = await Website.aggregate([
      { $match: { id } },
      { $unwind: '$events' },
      { $match: { 'events.timestamp': { $gte: previousStartDate, $lte: previousEndDate } } },
      {
        $group: {
          _id: null,
          uniqueVisitors: {
            $sum: {
              $cond: ['$events.unique_visitor', 1, 0],
            },
          },
          totalEvents: { $sum: 1 },
          bounces: {
            $sum: {
              $cond: [{ $and: [{ $lt: ['$events.timespent', 6] }, '$events.unique_visitor'] }, 1, 0],
            },
          },
          eventsWithTimeSpent: {
            $sum: {
              $cond: [{ $ne: ['$events.timespent', 0] }, 1, 0],
            },
          },
          totalTimeSpent: { $sum: '$events.timespent' },
        },
      },
      {
        $project: {
          _id: 0,
          uniqueVisitors: '$uniqueVisitors',
          totalEvents: '$totalEvents',
          bounceRate: {
            $cond: [{ $eq: ['$eventsWithTimeSpent', 0] }, 0, { $divide: ['$bounces', '$eventsWithTimeSpent'] }],
          },
          averageTimeSpent: {
            $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
          },
        },
      },
    ]);

    const defaultResults = [
      {
        uniqueVisitors: 0,
        totalEvents: 0,
        bounceRate: 0,
        averageTimeSpent: 0,
      },
    ];

    const interval_results = [];
    let currentStartDate = new Date(startDate);
    while (currentStartDate < endDate) {
      let currentEndDate = new Date(currentStartDate);
      switch (intervalUnit) {
        case 'hours':
          currentEndDate.setUTCHours(currentEndDate.getUTCHours() + interval);
          break;
        case 'days':
          currentEndDate.setUTCDate(currentEndDate.getUTCDate() + interval);
          break;
        case 'weeks':
          currentEndDate.setUTCDate(currentEndDate.getUTCDate() + interval * 7);
          break;
        case 'months':
          currentEndDate.setUTCMonth(currentEndDate.getUTCMonth() + interval);
          break;
        default:
          throw new Error('Invalid interval unit');
      }
      const interval_result = await Website.aggregate([
        { $match: { id } },
        { $unwind: '$events' },
        { $match: { 'events.timestamp': { $gte: currentStartDate, $lte: currentEndDate } } },
        {
          $group: {
            _id: null,
            uniqueVisitors: {
              $sum: {
                $cond: ['$events.unique_visitor', 1, 0],
              },
            },
            totalEvents: { $sum: 1 },
            bounces: {
              $sum: {
                $cond: [{ $and: [{ $lt: ['$events.timespent', 6] }, '$events.unique_visitor'] }, 1, 0],
              },
            },
            eventsWithTimeSpent: {
              $sum: {
                $cond: [{ $ne: ['$events.timespent', 0] }, 1, 0],
              },
            },
            totalTimeSpent: { $sum: '$events.timespent' },
          },
        },
        {
          $project: {
            _id: 0,
            uniqueVisitors: '$uniqueVisitors',
            totalEvents: '$totalEvents',
            bounceRate: {
              $cond: [{ $eq: ['$eventsWithTimeSpent', 0] }, 0, { $divide: ['$bounces', '$eventsWithTimeSpent'] }],
            },
            averageTimeSpent: {
              $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
            },
          },
        },
      ]);

      interval_result.length > 0
        ? interval_results.push({
            date: currentStartDate.toISOString(),
            ...interval_result[0],
          })
        : interval_results.push({
            date: currentStartDate.toISOString(),
            ...defaultResults[0],
          });

      currentStartDate = currentEndDate;
    }

    res.json({
      current: current_results.length > 0 ? current_results : defaultResults,
      previous: previous_results.length > 0 ? previous_results : defaultResults,
      interval: interval_results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUserData = async (event, context) => {
  const headers = event.headers || {};
  const authorizationHeader = headers.Authorization || headers.authorization || '';
  const accessToken = authorizationHeader.split(' ')[1];

  if (!accessToken) {
    return cb(null, {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    });
  }

  try {
    const response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub user data request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const avatar_url = data['avatar_url'];
    const userId = data['login'];

    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    let user = await User.findOne({ userId });
    let isNew = false;
    if (!user) {
      isNew = true;
      const today = new Date();
      const freeTrialDate = new Date(today);
      freeTrialDate.setDate(today.getDate() + 7);
      user = new User({ userId, avatar_url, isPremium: null, isFreeTrial: freeTrialDate });
      await user.save();
    }

    const responseBody = {
      login: userId,
      avatar_url,
      websites: user.websites,
      user,
      isNew,
    };

    return cb(null, {
      statusCode: 200,
      body: JSON.stringify(responseBody),
    });
  } catch (error) {
    console.error(error);
    return cb(null, {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving user data' }),
    });
  }
};

module.exports.getAccessToken = async (event, context) => {
  const queryParams = event.queryStringParameters || {};
  const code = queryParams.code;
  const params = `?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`;

  try {
    const response = await fetch('https://github.com/login/oauth/access_token' + params, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub access token request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const access_token = data.access_token;
    res.json({ message: 'SUCCESS', token: access_token });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving access token' });
  }
};
