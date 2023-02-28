const { mongoose, Schema } = require('./getMongoose');

const EmailVerificationSchema = new mongoose.Schema(
  {
   
    //TODO: should be changed to email
    customer_id: {
      type: String,
      // required: true,
    },
    uniqueString: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    
  }
);
// add category to the model select (hardware,software,sys admin,other)

module.exports = mongoose.model('EmailVerification', EmailVerificationSchema);
