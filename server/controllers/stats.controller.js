const asyncHandler = require('express-async-handler');
const Website = require('../models/website.model');
const { getDateRange } = require('../utils/statUtils');

const browsers = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { period } = req.query;
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
          totalTimeSpent: {
            $sum: {
              $cond: {
                if: { $gt: ['$events.timespent', 0] }, // Check if timespent is positive
                then: '$events.timespent', // Include in sum if positive
                else: 0, // Otherwise, add 0
              },
            },
          },
          eventsWithTimeSpent: { $sum: { $cond: [{ $ne: ['$events.timespent', 0] }, 1, 0] } },
          bounces: {
            $sum: {
              $cond: [{ $and: [{ $lt: ['$events.timespent', 6] }, '$events.unique_visitor'] }, 1, 0],
            },
          },
          visitFalseCount: { $sum: { $cond: [{ $eq: ['$events.visit', false] }, 1, 0] } },
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
          visitFalseCount: '$visitFalseCount',
          totalEvents: '$totalEvents',
          averageTimeSpent: {
            $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
          },
        },
      },
    ]);

    const totalUniqueVisitors = results.reduce((sum, item) => sum + item.uniqueVisitors, 0);
    const totalVisitFalse = results.reduce((sum, item) => sum + item.visitFalseCount, 0);
    const final_results = results.map((item) => ({
      ...item,
      averageTimeSpent: item.averageTimeSpent < 0 ? 0 : item.averageTimeSpent,
      visitFalseCountPercentage: totalVisitFalse > 0 ? (item.visitFalseCount / totalVisitFalse) * 100 : 0,
      visitorPercentage: totalUniqueVisitors > 0 ? (item.uniqueVisitors / totalUniqueVisitors) * 100 : 0,
    }));

    res.status(200).json(final_results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const countries = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { period } = req.query;
    const { startDate, endDate } = getDateRange(period);
    const results = await Website.aggregate([
      { $match: { id } },
      { $unwind: '$events' },
      { $match: { 'events.timestamp': { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$events.country',
          uniqueVisitors: { $sum: { $cond: ['$events.unique_visitor', 1, 0] } },
          totalTimeSpent: {
            $sum: {
              $cond: {
                if: { $gt: ['$events.timespent', 0] }, // Check if timespent is positive
                then: '$events.timespent', // Include in sum if positive
                else: 0, // Otherwise, add 0
              },
            },
          },
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
          visitFalseCount: { $sum: { $cond: [{ $eq: ['$events.visit', false] }, 1, 0] } },
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
          visitFalseCount: '$visitFalseCount',
          totalEvents: '$totalEvents',
          averageTimeSpent: {
            $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
          },
        },
      },
    ]);

    const totalUniqueVisitors = results.reduce((sum, item) => sum + item.uniqueVisitors, 0);
    const totalVisitFalse = results.reduce((sum, item) => sum + item.visitFalseCount, 0);
    const final_results = results.map((item) => ({
      ...item,
      averageTimeSpent: item.averageTimeSpent < 0 ? 0 : item.averageTimeSpent,
      visitFalseCountPercentage: totalVisitFalse > 0 ? (item.visitFalseCount / totalVisitFalse) * 100 : 0,
      visitorPercentage: totalUniqueVisitors > 0 ? (item.uniqueVisitors / totalUniqueVisitors) * 100 : 0,
    }));

    res.status(200).json(final_results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const languages = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { period } = req.query;
    const { startDate, endDate } = getDateRange(period);
    const results = await Website.aggregate([
      { $match: { id } },
      { $unwind: '$events' },
      { $match: { 'events.timestamp': { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$events.language',
          uniqueVisitors: { $sum: { $cond: ['$events.unique_visitor', 1, 0] } },
          totalTimeSpent: {
            $sum: {
              $cond: {
                if: { $gt: ['$events.timespent', 0] }, // Check if timespent is positive
                then: '$events.timespent', // Include in sum if positive
                else: 0, // Otherwise, add 0
              },
            },
          },
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
          visitFalseCount: { $sum: { $cond: [{ $eq: ['$events.visit', false] }, 1, 0] } },
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
          visitFalseCount: '$visitFalseCount',
          totalEvents: '$totalEvents',
          averageTimeSpent: {
            $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
          },
        },
      },
    ]);

    const totalUniqueVisitors = results.reduce((sum, item) => sum + item.uniqueVisitors, 0);
    const totalVisitFalse = results.reduce((sum, item) => sum + item.visitFalseCount, 0);
    const final_results = results.map((item) => ({
      ...item,
      averageTimeSpent: item.averageTimeSpent < 0 ? 0 : item.averageTimeSpent,
      visitFalseCountPercentage: totalVisitFalse > 0 ? (item.visitFalseCount / totalVisitFalse) * 100 : 0,
      visitorPercentage: totalUniqueVisitors > 0 ? (item.uniqueVisitors / totalUniqueVisitors) * 100 : 0,
    }));

    res.status(200).json(final_results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const os = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { period } = req.query;
    const { startDate, endDate } = getDateRange(period);

    const results = await Website.aggregate([
      { $match: { id } },
      { $unwind: '$events' },
      { $match: { 'events.timestamp': { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$events.operatingsystem',
          uniqueVisitors: { $sum: { $cond: ['$events.unique_visitor', 1, 0] } },
          totalTimeSpent: {
            $sum: {
              $cond: {
                if: { $gt: ['$events.timespent', 0] }, // Check if timespent is positive
                then: '$events.timespent', // Include in sum if positive
                else: 0, // Otherwise, add 0
              },
            },
          },
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
          visitFalseCount: { $sum: { $cond: [{ $eq: ['$events.visit', false] }, 1, 0] } },
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
          visitFalseCount: '$visitFalseCount',
          totalEvents: '$totalEvents',
          averageTimeSpent: {
            $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
          },
        },
      },
    ]);

    const totalUniqueVisitors = results.reduce((sum, item) => sum + item.uniqueVisitors, 0);
    const totalVisitFalse = results.reduce((sum, item) => sum + item.visitFalseCount, 0);
    const final_results = results.map((item) => ({
      ...item,
      averageTimeSpent: item.averageTimeSpent < 0 ? 0 : item.averageTimeSpent,
      visitFalseCountPercentage: totalVisitFalse > 0 ? (item.visitFalseCount / totalVisitFalse) * 100 : 0,
      visitorPercentage: totalUniqueVisitors > 0 ? (item.uniqueVisitors / totalUniqueVisitors) * 100 : 0,
    }));

    res.status(200).json(final_results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const devices = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { period } = req.query;
    const { startDate, endDate } = getDateRange(period);

    const results = await Website.aggregate([
      { $match: { id } },
      { $unwind: '$events' },
      { $match: { 'events.timestamp': { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$events.device',
          uniqueVisitors: { $sum: { $cond: ['$events.unique_visitor', 1, 0] } },
          totalTimeSpent: {
            $sum: {
              $cond: {
                if: { $gt: ['$events.timespent', 0] }, // Check if timespent is positive
                then: '$events.timespent', // Include in sum if positive
                else: 0, // Otherwise, add 0
              },
            },
          },
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
          visitFalseCount: { $sum: { $cond: [{ $eq: ['$events.visit', false] }, 1, 0] } },
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
          visitFalseCount: '$visitFalseCount',
          totalEvents: '$totalEvents',
          averageTimeSpent: {
            $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
          },
        },
      },
    ]);
    const totalUniqueVisitors = results.reduce((sum, item) => sum + item.uniqueVisitors, 0);
    const totalVisitFalse = results.reduce((sum, item) => sum + item.visitFalseCount, 0);
    const final_results = results.map((item) => ({
      ...item,
      averageTimeSpent: item.averageTimeSpent < 0 ? 0 : item.averageTimeSpent,
      visitFalseCountPercentage: totalVisitFalse > 0 ? (item.visitFalseCount / totalVisitFalse) * 100 : 0,
      visitorPercentage: totalUniqueVisitors > 0 ? (item.uniqueVisitors / totalUniqueVisitors) * 100 : 0,
    }));

    res.status(200).json(final_results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const referrers = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { period } = req.query;
    const { startDate, endDate } = getDateRange(period);
    const results = await Website.aggregate([
      { $match: { id } },
      { $unwind: '$events' },
      { $match: { 'events.timestamp': { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$events.referrers',
          uniqueVisitors: { $sum: { $cond: ['$events.unique_visitor', 1, 0] } },
          totalTimeSpent: {
            $sum: {
              $cond: {
                if: { $gt: ['$events.timespent', 0] }, // Check if timespent is positive
                then: '$events.timespent', // Include in sum if positive
                else: 0, // Otherwise, add 0
              },
            },
          },
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
          visitFalseCount: { $sum: { $cond: [{ $eq: ['$events.visit', false] }, 1, 0] } },
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
          visitFalseCount: '$visitFalseCount',
          totalEvents: '$totalEvents',
          averageTimeSpent: {
            $cond: [{ $eq: ['$totalEvents', 0] }, 0, { $divide: ['$totalTimeSpent', '$totalEvents'] }],
          },
        },
      },
    ]);

    const totalUniqueVisitors = results.reduce((sum, item) => sum + item.uniqueVisitors, 0);
    const totalVisitFalse = results.reduce((sum, item) => sum + item.visitFalseCount, 0);
    const final_results = results.map((item) => ({
      ...item,
      averageTimeSpent: item.averageTimeSpent < 0 ? 0 : item.averageTimeSpent,
      visitFalseCountPercentage: totalVisitFalse > 0 ? (item.visitFalseCount / totalVisitFalse) * 100 : 0,
      visitorPercentage: totalUniqueVisitors > 0 ? (item.uniqueVisitors / totalUniqueVisitors) * 100 : 0,
    }));

    res.status(200).json(final_results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const paths = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { period } = req.query;
    const { startDate, endDate } = getDateRange(period);
    const results = await Website.aggregate([
      { $match: { id } },
      { $unwind: '$events' },
      { $match: { 'events.timestamp': { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$events.path',
          uniqueVisitors: { $sum: { $cond: ['$events.unique_visitor', 1, 0] } },
          totalTimeSpent: {
            $sum: {
              $cond: {
                if: { $gt: ['$events.timespent', 0] }, // Check if timespent is positive
                then: '$events.timespent', // Include in sum if positive
                else: 0, // Otherwise, add 0
              },
            },
          },
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
          visitFalseCount: { $sum: { $cond: [{ $eq: ['$events.visit', false] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          path: '$_id',
          uniqueVisitors: '$uniqueVisitors',
          totalEvents: '$totalEvents',
          totalTime: '$totalTimeSpent',
          visitFalseCount: '$visitFalseCount',
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
      averageTimeSpent: item.averageTimeSpent < 0 ? 0 : item.averageTimeSpent,
      visitorPercentage: totalUniqueVisitors > 0 ? (item.uniqueVisitors / totalUniqueVisitors) * 100 : 0,
      eventPercentage: allEvents > 0 ? (item.totalEvents / allEvents) * 100 : 0,
    }));

    res.status(200).json(final_results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const summary = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { period } = req.query;
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
          visitFalseCount: { $sum: { $cond: [{ $eq: ['$events.visit', false] }, 1, 0] } },
          eventsWithTimeSpent: {
            $sum: {
              $cond: [{ $ne: ['$events.timespent', 0] }, 1, 0],
            },
          },
          totalTimeSpent: {
            $sum: {
              $cond: {
                if: { $gt: ['$events.timespent', 0] }, // Check if timespent is positive
                then: '$events.timespent', // Include in sum if positive
                else: 0, // Otherwise, add 0
              },
            },
          },
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
          visitFalseCount: '$visitFalseCount',
          averageTimeSpent: {
            $cond: [
              { $eq: ['$totalEvents', 0] },
              0,
              {
                $cond: [
                  { $lt: [{ $divide: ['$totalTimeSpent', '$totalEvents'] }, 0] },
                  0,
                  { $divide: ['$totalTimeSpent', '$totalEvents'] },
                ],
              },
            ],
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
          visitFalseCount: { $sum: { $cond: [{ $eq: ['$events.visit', false] }, 1, 0] } },
          eventsWithTimeSpent: {
            $sum: {
              $cond: [{ $ne: ['$events.timespent', 0] }, 1, 0],
            },
          },
          totalTimeSpent: {
            $sum: {
              $cond: {
                if: { $gt: ['$events.timespent', 0] }, // Check if timespent is positive
                then: '$events.timespent', // Include in sum if positive
                else: 0, // Otherwise, add 0
              },
            },
          },
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
          visitFalseCount: '$visitFalseCount',
          averageTimeSpent: {
            $cond: [
              { $eq: ['$totalEvents', 0] },
              0,
              {
                $cond: [
                  { $lt: [{ $divide: ['$totalTimeSpent', '$totalEvents'] }, 0] },
                  0,
                  { $divide: ['$totalTimeSpent', '$totalEvents'] },
                ],
              },
            ],
          },
        },
      },
    ]);

    const defaultResults = [
      {
        uniqueVisitors: 0,
        totalEvents: 0,
        bounceRate: 0,
        visitFalseCount: 0,
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
            visitFalseCount: { $sum: { $cond: [{ $eq: ['$events.visit', false] }, 1, 0] } },
            eventsWithTimeSpent: {
              $sum: {
                $cond: [{ $ne: ['$events.timespent', 0] }, 1, 0],
              },
            },
            totalTimeSpent: {
              $sum: {
                $cond: {
                  if: { $gt: ['$events.timespent', 0] }, // Check if timespent is positive
                  then: '$events.timespent', // Include in sum if positive
                  else: 0, // Otherwise, add 0
                },
              },
            },
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
            visitFalseCount: '$visitFalseCount',
            averageTimeSpent: {
              $cond: [
                { $eq: ['$totalEvents', 0] },
                0,
                {
                  $cond: [
                    { $lt: [{ $divide: ['$totalTimeSpent', '$totalEvents'] }, 0] },
                    0,
                    { $divide: ['$totalTimeSpent', '$totalEvents'] },
                  ],
                },
              ],
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
});

module.exports = {
  devices,
  countries,
  languages,
  os,
  browsers,
  referrers,
  paths,
  summary,
};
