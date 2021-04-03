const User = require('../models/User');
const Encryptor = require('../helpers/Encryptor');

const encryptor = new Encryptor();
// TODO: add JWT generating and sending
module.exports = {
  async register(req, res) {
    try {
      const passwordHash = await encryptor.hash(req.body.password);
      const user = new User({
        email: req.body.email,
        password: passwordHash,
      });

      await user.save();

      res.send('registered')
    } catch (err) {
      console.warn(err);
    }
  }
};
