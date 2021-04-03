const bcrypt = require('bcrypt');

class Encryptor {
  constructor(saltRounds) {
    this.saltRounds = saltRounds || 10;
  }

  hash(plainText) {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  hashSync(plainText) {
    return bcrypt.hashSync(plainText, this.saltRounds);
  }

  compare(plainText, hash) {
    return bcrypt.compareSync(plainText, hash);
  }

  compareSync(plainText, hash) {
    return bcrypt.compareSync(plainText, hash);
  }
}

module.exports = Encryptor;
