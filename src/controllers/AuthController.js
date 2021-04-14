const User = require('../models/User');
const Encryptor = require('../helpers/Encryptor');
const generateAccessToken = require('../helpers/generateAccessToken');
const wrapErrorResponse = require('../helpers/wrapErrorResponse');
const generateCustomErr = require('../helpers/generateCustomError');

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
      next(generateCustomErr(req.t('errors.response.registrationErr'), err.message));
    }
  },

  async login(req, res, next) {
    const { password, email } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(404).send(wrapErrorResponse(req.t('errors.response.loginCredentialsErr')));
      }

      const isRightPassword = encryptor.compare(password, user.password);

      if (!isRightPassword) {
        return res.status(404).send(wrapErrorResponse(req.t('errors.response.loginCredentialsErr')));
      }

      const accessToken = generateAccessToken(user);

      user = user.toObject();
      delete user.password;
      throw new Error()

      res.send({ data: {
          accessToken,
          user,
        }
      });
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.loginErr'), err.message));
    }
  }
};
