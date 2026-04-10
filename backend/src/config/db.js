const mongoose = require('mongoose');

const connect = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/project_mgmt';

  // Try the configured URI first; fall back to in-memory MongoDB for demo/dev
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log(`MongoDB connected → ${uri}`);
  } catch (_err) {
    console.warn('Real MongoDB unavailable – starting in-memory MongoDB for demo...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    await mongoose.connect(memUri);
    console.log(`MongoDB (in-memory) connected → ${memUri}`);
  }
};

module.exports = { connect };
