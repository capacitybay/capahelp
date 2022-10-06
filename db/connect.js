const mongoose = require('mongoose');
// database connector
const connectDb = (url) => {
  return mongoose.connect(url);
  console.log('mongdb is connected');
};

module.exports = connectDb;
