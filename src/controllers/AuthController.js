const User = require('../models/User');
const Encryptor = require('../helpers/Encryptor');
const generateAccessToken = require('../helpers/generateAccessToken');
const wrapErrorResponse = require('../helpers/wrapErrorResponse');

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
        return res.status(404).send(wrapErrorResponse('errors.response.loginEmailErr'));
      }

      const isRightPassword = encryptor.compare(password, user.password);

      if (!isRightPassword) {
        return res.status(404).send(wrapErrorResponse('errors.response.loginPasswordErr'));
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
