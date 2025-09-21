const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const envPaths = [
  path.resolve(__dirname, '..', '.env.local'),
  path.resolve(__dirname, '..', '.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

(async () => {
  try {
    console.log('uri', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
    const { db } = mongoose.connection;
    const collections = await db.listCollections().toArray();
    console.log('collections', collections.map((c) => c.name));
    const count = await db.collection('ttontokposts').countDocuments();
    console.log('ttontokposts count', count);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
})();
