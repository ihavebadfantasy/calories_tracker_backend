const crypto = require('crypto');
const Encryptor = require('./Encryptor');

const encryptor = new Encryptor();

module.exports = async () => {
  const resetPasswordToken = crypto.randomBytes(32).toString("hex");

  return await encryptor.hash(resetPasswordToken);
}
