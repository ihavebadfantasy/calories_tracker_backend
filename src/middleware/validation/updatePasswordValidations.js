const { check } = require('express-validator');
const User = require('../../models/User');
const Encryptor = require('../../helpers/Encryptor');

const encryptor = new Encryptor();

module.exports = [
  check('oldPassword')
    .notEmpty()
    .custom(async (value, { req }) => {
      const user = await User.findOne({ _id: req.user.id });
      if (!user) {
        throw new Error(req.t('errors.validation.oldPasswordCheck'));
      }

      const isOldPasswordValid = await encryptor.compare(value, user.password);

      if (!isOldPasswordValid) {
        throw new Error(req.t('errors.validation.oldPasswordCheck'));
      } else {
        return true;
      }
    }),
  check('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage((value, { req }) => {
      return req.t('errors.validation.passwordLengthValidation');
    }),
  check('passwordConfirmation')
    .trim()
    .custom((value, { req }) => {
      if(value !== req.body.password) {
        throw new Error(req.t('errors.validation.passwordConfirmationRequiredValidation'));
      } else {
        return true;
      }
    }),
];
