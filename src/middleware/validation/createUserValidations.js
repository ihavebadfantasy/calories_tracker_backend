const { check } = require('express-validator');
const numberCheck = require('./numberCheck');

module.exports = [
  check('username')
    .notEmpty()
    .trim()
    .withMessage((value, { req }) => {
      return req.t('errors.validation.usernameRequiredCheck');
    }),
  check('weight')
    .custom((value, { req }) => {
      return numberCheck(value, req.t('errors.validation.weightNumberCheck'));
    }),
  check('age')
    .custom((value, { req }) => {
      return numberCheck(value, req.t('errors.validation.ageNumberCheck'));
    }),
  check('caloriesPerDay')
    .custom((value, { req }) => {
      return numberCheck(value, req.t('errors.validation.caloriesPerDayNumberCheck'));
    }),
];
