const mongoose = require('mongoose');
// database connector
const connectDb = (url) => {
  return mongoose.connect(url);
};

module.exports = connectDb;
