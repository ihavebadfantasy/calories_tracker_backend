const { check } = require('express-validator');
const numberCheck = require('./numberCheck');

module.exports = [
  check('weight')
    .optional()
    .custom((value, { req }) => {
      return numberCheck(value, req.t('errors.weightNumberCheck'));
    }),
];
