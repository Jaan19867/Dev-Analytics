const asyncHandler = require('express-async-handler');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const User = require('../models/user.model');

const getUserData = asyncHandler(async (req, res) => {
  const accessToken = req.headers.authorization.split(' ')[1];
  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
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

    res.json({ login: userId, avatar_url, websites: user.websites, user, isNew });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});

const getAccessToken = asyncHandler(async (req, res) => {
  const code = req.query.code;
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
    console.error(error);
    res.status(500).json({ message: 'Error retrieving access token' });
  }
});

module.exports = {
  getAccessToken,
  getUserData,
};
