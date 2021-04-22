const User = require('../models/User');
const Encryptor = require('../helpers/Encryptor');
const generateAccessToken = require('../helpers/generateAccessToken');
const generateRefreshToken = require('../helpers/generateRefreshToken');
const wrapErrorResponse = require('../helpers/wrapErrorResponse');
const generateCustomErr = require('../helpers/generateCustomError');
const generateMailingToken = require('../helpers/generateMailingToken');
const Mailer = require('../mailer/Mailer');

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
        return res.status(401).send(wrapErrorResponse(new Error(req.t('errors.response.loginCredentialsErr'))));
      }

      const isRightPassword = await encryptor.compare(password, user.password);

      if (!isRightPassword) {
        return res.status(401).send(wrapErrorResponse(new Error(req.t('errors.response.loginCredentialsErr'))));
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
        return res.status(404).send(wrapErrorResponse(new Error(req.t('errors.response.userNotFoundErr'))));
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
  },

  async forgotPassword(req, res, next) {
    const { email } = req.body;
    try {
      // checking if user exists
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).send(wrapErrorResponse(new Error(req.t('errors.response.userNotFoundErr'))));
      }

      // generating and saving resetPasswordToken hash data for user
      const resetPasswordToken = generateMailingToken();
      const resetPasswordTokenHash = await encryptor.hash(resetPasswordToken);

      user.resetPasswordToken = resetPasswordTokenHash;
      await user.save();

      // sending resetEmail
      Mailer.$instance.sendResetPasswordEmail(req, user, resetPasswordToken);

      res.status(200).send({});
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.generalErr'), err.message));
    }
  },

  async createNewPassword(req, res, next) {
    const { password, token, id } = req.body;

    try {
      // checking if the user exists
      const user = await User.findOne({ _id: id });
      if (!user) {
        return res.status(404).send(wrapErrorResponse(new Error(req.t('errors.response.userNotFoundErr'))));
      }
      // check if resetPasswordToken is valid
      const isTokenValid = await encryptor.compare(token, user.resetPasswordToken);
      if (!isTokenValid) {
        return res.status(422).send(wrapErrorResponse(new Error(req.t('errors.response.resetPasswordTokenErr'))));
      }

      // update user's password and tokens
      user.password = await encryptor.hash(password);
      user.resetPasswordToken = null;
      user.tokens = [];

      await user.save();

      Mailer.$instance.sendNewPasswordWasSetEmail(req, user);

      res.status(200).send({});
    } catch(err) {
      next(generateCustomErr(req.t('errors.response.createNewPasswordErr'), err.message));
    }
  }
};
