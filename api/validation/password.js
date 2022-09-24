const bcrypt = require("bcrypt");
const saltRounds = 10;

async function hashedPassword(password) {
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
}
async function unHashPassword(plainPassword, hashedPassword) {
  const decode = await bcrypt.compare(plainPassword, hashedPassword);
  return decode;
}

module.exports.hashedPassword = hashedPassword;
module.exports.unHashPassword = unHashPassword;
