const { check } = require('express-validator');
const numberCheck = require('./numberCheck');

module.exports = [
  check('calories')
    .notEmpty()
    .withMessage('Укажите количество калорий')
    .custom((value) => {
      return numberCheck(value, 'Укажите количество калорий числом')
    }),
];
