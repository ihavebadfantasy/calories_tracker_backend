const User = require('../models/User');
const Encryptor = require('../helpers/Encryptor');
const generateAccessToken = require('../helpers/generateAccessToken');
const generateRefreshToken = require('../helpers/generateRefreshToken');
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

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      user.tokens = [{
        token: accessToken,
        refreshToken
      }];
      await user.save();

      res.status(201).send({ data: {
          accessToken,
          refreshToken
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
        return res.status(401).send(wrapErrorResponse(req.t('errors.response.loginCredentialsErr')));
      }

      const isRightPassword = encryptor.compare(password, user.password);

      if (!isRightPassword) {
        return res.status(401).send(wrapErrorResponse(req.t('errors.response.loginCredentialsErr')));
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      user.tokens.push({
        token: accessToken,
        refreshToken
      });

      await user.save();

      res.status(201).send({ data: {
          accessToken,
          refreshToken,
          user,
        }
      });
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.loginErr'), err.message));
    }
  },

  async logout(req, res, next) {
    const { id } = req.user;
    const { token } = req;

    try {
      const user = await User.findOneAndUpdate({ _id: id }, {
        '$pull': {
          tokens: {
            token,
          }
        }
      })

      if (!user) {
        return res.status(404).send(wrapErrorResponse(req.t('errors.response.userNotFoundErr')));
      }

      res.status(201).send();
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.logoutErr'), err.message));
    }
  },

  async refresh(req, res, next) {
    const { id } = req.user;
    const { refreshToken: oldRefreshToken } = req.body;
    const { token: oldToken } = req;

    try {
      const accessToken = generateAccessToken({ _id: id });
      const refreshToken = generateRefreshToken({ _id: id });

      let user = await User.findOneAndUpdate({ _id: id }, {
        '$pull': {
          tokens: {
            token: oldToken,
            refreshToken: oldRefreshToken,
          }
        }
      });

      user = await User.findOneAndUpdate({ _id: id }, {
        '$push': {
          tokens: {
            token: accessToken,
            refreshToken,
          }
        }
      })

      if (!user) {
        throw new Error();
      }

      res.status(201).send({ data: {
          accessToken,
          refreshToken
        }
      });
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.refreshErr'), err.message));
    }
  }
};
