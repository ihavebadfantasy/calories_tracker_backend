const User = require('../models/User');
const Encryptor = require('../helpers/Encryptor');
const generateAccessToken = require('../helpers/generateAccessToken');

const encryptor = new Encryptor();

module.exports = {
  async register(req, res, next) {
    try {
      const passwordHash = await encryptor.hash(req.body.password);
      const user = new User({
        email: req.body.email,
        password: passwordHash,
      });

      await user.save();

      const accessToken = generateAccessToken(user);

      res.send({ data: {
          accessToken,
        }
      });
    } catch (err) {
      next(new Error(req.t('errors.response.registrationErr')));
    }
  },

  async login(req, res, next) {
    const { password, email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        next(new Error(req.t('errors.response.loginEmailErr')));
      }

      const isRightPassword = encryptor.compare(password, user.password);

      if (!isRightPassword) {
        next(new Error(req.t('errors.response.loginPasswordErr')));
      }

      const accessToken = generateAccessToken(user);

      res.send({ data: {
          accessToken,
        }
      });
    } catch (err) {
      next(new Error(req.t('errors.response.loginErr')));
    }
  }
};
