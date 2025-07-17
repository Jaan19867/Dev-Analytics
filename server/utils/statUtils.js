const getDateRange = (period) => {
  const now = new Date();
  let startDate, endDate, previousStartDate, previousEndDate, interval, intervalUnit;

  switch (period) {
    case 'today':
      startDate = new Date(now);
      startDate.setUTCHours(0, 0, 0, 0);
      endDate = new Date(now);
      previousStartDate = new Date(now);
      previousStartDate.setUTCDate(startDate.getUTCDate() - 1);
      previousStartDate.setUTCHours(0, 0, 0, 0);
      previousEndDate = startDate;
      interval = 1;
      intervalUnit = 'hours'; // 2-hour intervals for detailed daily view
      break;
    case 'yesterday':
      startDate = new Date(now);
      startDate.setUTCDate(startDate.getUTCDate() - 1);
      startDate.setUTCHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setUTCHours(23, 59, 59, 999);
      previousStartDate = new Date(now);
      previousStartDate.setUTCDate(previousStartDate.getUTCDate() - 2);
      previousStartDate.setUTCHours(0, 0, 0, 0);
      previousEndDate = startDate;
      interval = 2;
      intervalUnit = 'hours'; // 2-hour intervals for detailed daily view
      break;
    case '12h':
      endDate = new Date(now);
      startDate = new Date(endDate);
      startDate.setUTCHours(startDate.getUTCHours() - 12, 0, 0, 0);
      previousStartDate = new Date(now);
      previousStartDate.setUTCHours(startDate.getUTCHours() - 24, 0, 0, 0);
      previousEndDate = startDate;
      interval = 1;
      intervalUnit = 'hours'; // 1-hour intervals for short-term view
      break;
    case '24h':
      endDate = new Date(now);
      startDate = new Date(endDate);
      startDate.setUTCHours(startDate.getUTCHours() - 24, 0, 0, 0);
      previousStartDate = new Date(now);
      previousStartDate.setUTCHours(startDate.getUTCHours() - 48, 0, 0, 0);
      previousEndDate = startDate;
      interval = 2;
      intervalUnit = 'hours'; // 2-hour intervals for detailed 24-hour view
      break;
    case '72h':
      endDate = new Date(now);
      startDate = new Date(endDate);
      startDate.setUTCHours(startDate.getUTCHours() - 72, 0, 0, 0);
      previousStartDate = new Date(now);
      previousStartDate.setUTCHours(startDate.getUTCHours() - 144, 0, 0, 0);
      previousEndDate = startDate;
      interval = 4;
      intervalUnit = 'hours'; // 4-hour intervals for 3-day view
      break;
    case '7d':
      endDate = new Date(now);
      startDate = new Date(endDate);
      startDate.setUTCDate(startDate.getUTCDate() - 7);
      previousStartDate = new Date(now);
      previousStartDate.setUTCDate(previousStartDate.getUTCDate() - 14);
      previousEndDate = startDate;
      interval = 1;
      intervalUnit = 'days'; // 1-day intervals for week-long view
      break;
    case '14d':
      endDate = new Date(now);
      startDate = new Date(endDate);
      startDate.setUTCDate(startDate.getUTCDate() - 14);
      previousStartDate = new Date(now);
      previousStartDate.setUTCDate(previousStartDate.getUTCDate() - 28);
      previousEndDate = startDate;
      interval = 1;
      intervalUnit = 'days'; // 1-day intervals for bi-weekly view
      break;
    case '30d':
      endDate = new Date(now);
      startDate = new Date(endDate);
      startDate.setUTCDate(startDate.getUTCDate() - 30);
      previousStartDate = new Date(now);
      previousStartDate.setUTCDate(previousStartDate.getUTCDate() - 60);
      previousEndDate = startDate;
      interval = 1;
      intervalUnit = 'days'; // 1-day intervals for monthly view
      break;
    case 'quarter':
      endDate = new Date(now);
      startDate = new Date(endDate);
      startDate.setUTCDate(startDate.getUTCDate() - 90);
      previousStartDate = new Date(now);
      previousStartDate.setUTCDate(previousStartDate.getUTCDate() - 180);
      previousEndDate = startDate;
      interval = 1;
      intervalUnit = 'weeks'; // 1-week intervals for quarterly view
      break;
    case 'halfyear':
      endDate = new Date(now);
      startDate = new Date(endDate);
      startDate.setUTCDate(startDate.getUTCDate() - 180);
      previousStartDate = new Date(now);
      previousStartDate.setUTCDate(previousStartDate.getUTCDate() - 360);
      previousEndDate = startDate;
      interval = 1;
      intervalUnit = 'months'; // 1-month intervals for half-year view
      break;
    case 'year':
      endDate = new Date(now);
      startDate = new Date(endDate);
      startDate.setUTCFullYear(startDate.getUTCFullYear() - 1);
      previousStartDate = new Date(now);
      previousStartDate.setUTCFullYear(previousStartDate.getUTCFullYear() - 2);
      previousEndDate = startDate;
      interval = 1;
      intervalUnit = 'months'; // 1-month intervals for yearly view
      break;
    default:
      throw new Error('Invalid period');
  }

  return { startDate, endDate, previousStartDate, previousEndDate, interval, intervalUnit };
};

module.exports = {
  getDateRange,
};
