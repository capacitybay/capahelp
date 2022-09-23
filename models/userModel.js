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
      type: Array,
    },
    address: {
      type: String,
    },
    user_type: {
      type: Number,
    },
    active: {
      type: Boolean, // will be set to true if the user account  is active
    },
    // this will be changed to date
    last_logged_in: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
