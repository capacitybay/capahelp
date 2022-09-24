const { mongoose, Schema } = require("./getMongoose");

const TicketSchema = new mongoose.Schema(
  {
    ticket_type: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    customer_id: {
      type: String,
    },
    assignee_id: {
      type: String,
    },
    dept_id: {
      type: String,
    },
    urgency: {
      type: String,
    },
    priority: {
      type: String,
    },
    ticket_status: {
      type: String,
    },
    attachment: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tickets", TicketSchema);
