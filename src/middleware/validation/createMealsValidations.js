const { check } = require('express-validator');
const numberCheck = require('./numberCheck');

module.exports = [
  check('calories')
    .custom((value, { req }) => {
      return numberCheck(value, req.t('errors.validation.caloriesNumberCheck'))
    }),
];
