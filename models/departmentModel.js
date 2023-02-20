const { mongoose, Schema } = require('./getMongoose');
const uniqueValidator = require('mongoose-unique-validator');
const DepartmentSchema = new mongoose.Schema(
  {
    dept_name: {
      type: String,
      required: true,
      index: true,
      unique: true,
      uniqueCaseInsensitive: true,
    },
    head_agent: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      // message: '{VALUE} email already exists',
    },
    members: {
      type: Array,

      // required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'Department',
  DepartmentSchema.plugin(uniqueValidator, {
    message: '{VALUE}  already exists!',
  })
);
