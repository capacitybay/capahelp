const { mongoose } = require('./getMongoose');

const RefreshTokenSchema = new mongoose.Schema(
  {
    user_id: String,
    refreshToken: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('RefreshTokens', RefreshTokenSchema);
