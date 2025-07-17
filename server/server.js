const express = require('express');
const cors = require('cors');
const connectDb = require('./config/dbConnection');
const path = require('path');
const bodyParser = require('body-parser');
const { getKey } = require('./utils/encrypt');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function startServer() {
  try {
    const hashMap = new Map();
    module.exports.users = hashMap;

    const addToHashMap = (key, value) => {
      const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes from now
      hashMap.set(key, { value, expirationTime });
    };
    module.exports.addHashmap = addToHashMap;

    const privateKey = await getKey().then((data) => data.replace(/\\n/g, '\n'));
    module.exports.private_key = privateKey;

    connectDb();

    const app = express();
    const port = process.env.PORT || 5000;

    app.use(express.json());
    app.use(bodyParser.text());
    app.use(cors({ credentials: true }));

    app.use('/api', require('./routes/user.routes'));
    app.use('/api/event', require('./routes/event.routes'));
    app.use('/api/dashboard', require('./routes/dashboard.routes'));
    app.use('/api', require('./routes/stats.routes'));
    app.use('/api/subscription', require('./routes/subscription.routes'));
    app.use('/api/keys', require('./routes/api.routes'));

    setInterval(() => {
      const now = Date.now();
      hashMap.forEach((entry, key) => {
        if (entry.expirationTime <= now) {
          hashMap.delete(key);
          console.log(`Entry for ${key} removed`);
        }
      });
    }, 60 * 1000);

    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to retrieve private key:', error);
    process.exit(1);
  }
}

startServer();
