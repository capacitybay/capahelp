const mongoose = require("mongoose");
// database connector
const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("mongdb is connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connection;
