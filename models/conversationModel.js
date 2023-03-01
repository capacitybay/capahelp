const { mongoose, Schema } = require('./getMongoose');

const conversationModel = new mongoose.Schema(
  {
    sendersFName:{
      type: String,
    },
    sendersLName:{
      type: String,
    },
    message:{
      type: String,
    },
    user_type:{
      type: String,
    },
    attachments:{
      type: Array,
    }
  },
  { timestamps: true }
);
// add category to the model select (hardware,software,sys admin,other)
const Conversation = mongoose.model('Conversation', conversationModel);

module.exports = {
  conversationModel,
  Conversation,
};