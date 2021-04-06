const { check } = require('express-validator');
const numberCheck = require('./numberCheck');

module.exports = [
  check('caloriesLeft')
    .custom((value) => {
      return numberCheck(value, 'Укажите количество калорий числом')
    }),
  check('weight')
    .custom((value) => {
      return numberCheck(value, 'Укажите вес числом')
    }),
];
