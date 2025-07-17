function getTodaysDate() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today.toISOString().split('T')[0];
}

function extractDateFromHeader(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

module.exports = { getTodaysDate, extractDateFromHeader };
