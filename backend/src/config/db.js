const mongoose = require('mongoose');

const connect = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/project_mgmt';
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};

module.exports = { connect };
