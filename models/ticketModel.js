const { mongoose, Schema } = require('./getMongoose');

const TicketSchema = new mongoose.Schema(
  {
    ticket_type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    customer_id: {
      type: String,
      required: true,
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

module.exports = mongoose.model('Tickets', TicketSchema);
