const { check } = require('express-validator');
const numberCheck = require('./numberCheck');

module.exports = [
  check('calories')
    .optional()
    .custom((value, { req }) => {
      return numberCheck(value, req.t('errors.validation.caloriesNumberCheck'));
    }),
  check('duration')
    .optional()
    .custom((value, { req }) => {
      return numberCheck(value, req.t('errors.validation.caloriesNumberCheck'));
    }),
];
