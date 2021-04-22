const { check } = require('express-validator');
const numberCheck = require('./numberCheck');
const User = require('../../models/User');

module.exports = [
  check('email')
    .optional()
    .normalizeEmail()
    .isEmail()
    .withMessage((value, { req }) => {
      return req.t('errors.validation.emailFormatCheck');
    })
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error(req.t('errors.validation.emailUniqueCheck'));
      } else {
        return true;
      }
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
