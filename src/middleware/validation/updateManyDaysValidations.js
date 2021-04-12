const { check } = require('express-validator');

module.exports = [
  check('statisticsEnabled')
    .notEmpty(),
  check('daysIds')
    .custom((value, { req }) => {
      console.log('in custom');
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error(req.t('errors.validation.daysIdsNotEmptyArrCheck'));
      } else {
        return true;
      }
    }),
];
