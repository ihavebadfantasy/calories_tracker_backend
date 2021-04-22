const { check } = require('express-validator');

module.exports = [
  check('id')
    .notEmpty(),
  check('token')
    .notEmpty(),
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
