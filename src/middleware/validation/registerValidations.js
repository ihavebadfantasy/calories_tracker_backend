const { check } = require('express-validator');
const User = require('../../models/User');

module.exports = [
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage((value, { req }) => {
      return req.t('errors.validation.emailRequiredCheck');
    })
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error(req.t('errors.validation.passwordUniqueCheck'));
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
