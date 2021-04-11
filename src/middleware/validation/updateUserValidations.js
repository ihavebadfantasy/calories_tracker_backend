const { check } = require('express-validator');
const numberCheck = require('./numberCheck');

module.exports = [
  check('email')
    .optional()
    .normalizeEmail()
    .isEmail()
    .withMessage((value, { req }) => {
      return req.t('errors.validation.emailFormatCheck');
    }),
  check('weight')
    .optional()
    .custom((value, { req }) => {
      return numberCheck(value, req.t('errors.validation.weightNumberCheck'));
    }),
  check('age')
    .optional()
    .custom((value, { req }) => {
      return numberCheck(value, req.t('errors.validation.ageNumberCheck'));
    }),
  check('caloriesPerDay')
    .optional()
    .custom((value, { req }) => {
      return numberCheck(value, req.t('errors.validation.caloriesPerDayCheck'));
    }),
];
