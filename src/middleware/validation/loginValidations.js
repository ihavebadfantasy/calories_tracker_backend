const { check } = require('express-validator');

module.exports = [
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage((value, { req }) => {
      return req.t('errors.validation.emailRequiresCheck');
    }),
  check('password')
    .notEmpty()
    .withMessage((value, { req }) => {
      return req.t('errors.validation.passwordRequiredCheck');
    }),
];
