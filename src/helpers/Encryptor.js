const bcrypt = require('bcrypt');

class Encryptor {
  constructor(saltRounds) {
    this.saltRounds = saltRounds || 10;
  }

  async hash(plainText) {
    return await bcrypt.hash(plainText, this.saltRounds);
  }

  hashSync(plainText) {
    return bcrypt.hashSync(plainText, this.saltRounds);
  }

  async compare(plainText, hash) {
    return await bcrypt.compareSync(plainText, hash);
  }

  compareSync(plainText, hash) {
    return bcrypt.compareSync(plainText, hash);
  }
}

module.exports = Encryptor;
