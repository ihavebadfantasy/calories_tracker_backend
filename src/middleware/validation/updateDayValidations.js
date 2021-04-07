const { check } = require('express-validator');
const numberCheck = require('./numberCheck');

module.exports = [
  check('weight')
    .custom((value) => {
      return numberCheck(value, 'Укажите вес числом')
    }),
];
