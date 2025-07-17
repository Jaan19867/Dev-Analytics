const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const Website = require('../models/website.model');

const addWebsite = asyncHandler(async (req, res) => {
  const { userId, website, description, id } = req.body;

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
});

const removeWebsite = asyncHandler(async (req, res) => {
  const { userId, id } = req.body;

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
});

module.exports = { addWebsite, removeWebsite };
