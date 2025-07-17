const asyncHandler = require('express-async-handler');
const { encrypt } = require('../utils/encrypt');

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC14j/8O5RbbFGefEELwFKH/09Y
j8firY8SI0pPz0/xl3z69JAphxHTdeEmA9PaP6h6kxUnJ3NTqeC1zxKwNIYI7I2z
V1/SfCEyAGsgC4mEvtfjXQaskyZcDMbi7NvKPVzulpQMwOHMSgMIeFja1wewb3zs
YSj1KQlq6L54cubADQIDAQAB
-----END PUBLIC KEY-----`;

const getApiKey = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const time = Date.now().toLocaleString();
  const data = `${username}:${time}`;
  const api_key = encrypt(data, PUBLIC_KEY);
  res.status(200).json({ api_key });
});

module.exports = {
  getApiKey,
};
