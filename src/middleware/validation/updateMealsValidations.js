const { check } = require('express-validator');
const numberCheck = require('./numberCheck');

module.exports = [
  check('calories')
    .optional()
    .custom((value) => {
      return numberCheck(value, 'Укажите количество калорий числом')
    }),
];
