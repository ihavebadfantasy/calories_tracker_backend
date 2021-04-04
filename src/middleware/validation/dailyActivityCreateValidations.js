const { check } = require('express-validator');
const numberCheck = require('./numberCheck');

module.exports = [
  check('calories')
    .notEmpty()
    .withMessage('Введите количество калорий')
    .custom((value) => {
      return numberCheck(value, 'Количество калорий должно быть числом')
    }),
  check('duration')
    .optional()
    .custom((value) => {
      return numberCheck(value, 'Продолжительность должна быть количеством минут')
    }),
];
