const mongoose = require("mongoose");
// database connector
const connection = async () => {
  await mongoose.connect(process.env.DB_URL, () => {
    console.log(" connected  to mongodb"),
      (err) => {
        console.log(err);
      };
  });
};

module.exports = connection;
