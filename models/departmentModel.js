const { mongoose, Schema } = require('./getMongoose');

const DepartmentSchema = new mongoose.Schema(
  {
    dept_name: {
      type: String,
      required: true,
    },
    head_agent: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    members: {
      type: Array,

      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', DepartmentSchema);
