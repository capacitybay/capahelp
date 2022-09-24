const { mongoose, Schema } = require("./getMongoose");

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Array,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    user_type: {
      type: Number,
      required: true,
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
