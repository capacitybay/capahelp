const { mongoose, Schema } = require('./getMongoose');

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      min: [2, 'Must be at least 2'],
      max: 30,
      required: [true, 'First name is required'],
    },
    last_name: {
      type: String,
      min: [2, 'Must be at least 2'],
      max: 30,
      required: [true, 'First name is required'],
    },
    email: {
      type: String,
      required: [true, ' email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password field cannot be empty'],
      min: [8, 'Password must be at least 8 characters'],
      max: [30, 'Password must be at most 30 characters'],
      // validate: {
      //   validator: isValidPassword,
      //   message:
      //     'Password must have at least: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
      // },
    },
    phone: {
      type: String,
      min: [10, 'phone must be at least 10'],
      max: [15, 'phone must be at most 15'],
      required: [true, 'User phone number required'],
      match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
    },
    location: {
      type: String,
      required: true,
    },
    user_type: {
      type: Number,
      default: 0,
      required: true,
    },
    active: {
      type: Boolean, // will be set to true if the user account  is active
      default: true,
    },
    // this will be changed to date
    last_logged_in: {},
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
