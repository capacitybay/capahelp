const { mongoose, Schema } = require('./getMongoose');

const ConversationSchema = new mongoose.Schema(
  {
    
  },
  { timestamps: true }
);
// add category to the model select (hardware,software,sys admin,other)

module.exports = mongoose.model('Conversations', ConversationSchema);
