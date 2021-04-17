const { check } = require('express-validator');

module.exports = [
  check('refreshToken')
    .notEmpty()
    .withMessage((value, { req }) => {
      return req.t('errors.validation.refreshTokenCheck');
    }),
];
