const { mongoose, Schema } = require("./getMongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    dept_name: {
      type: String,
    },
    head_agent: {
      type: String,
    },
    email: {
      type: String,
    },
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", DepartmentSchema);
