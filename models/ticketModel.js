const { mongoose, Schema } = require('./getMongoose');

const TicketSchema = new mongoose.Schema(
  {
    ticket_type: {
      type: String,
      required: true,
      // unique:true
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    //TODO: should be changed to email
    customer_id: {
      type: String,
      // required: true,
    },
    //TODO: should be changed to email
    assignee_id: {
      type: String,
    },
    dept_id: {
      type: String,
    },
    urgency: {
      type: String,
      default: 'open',
    },
    priority: {
      type: String,
      default: 'low',
    },
    ticket_status: {
      type: String,
      default: 'pending',
    },
    attachment: {
      type: Array,
    },
  },
  { timestamps: true }
);
// add category to the model select (hardware,software,sys admin,other)

module.exports = mongoose.model('Tickets', TicketSchema);
