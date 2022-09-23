const { mongoose, Schema } = require("./getMongoose");

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    has_logged_in: {
      type: Boolean,
    },
    active: {
      type: Boolean,
    },
    // this will be changed to date
    last_logged_in: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
