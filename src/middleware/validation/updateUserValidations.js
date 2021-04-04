const { check } = require('express-validator');
const numberCheck = require('./numberCheck');

module.exports = [
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Почта должна быть настоящим email-адресом'),
  check('weight')
    .custom((value) => {
      return numberCheck(value, 'Вес должен быть числом');
    }),
  check('age')
    .custom((value) => {
      return numberCheck(value, 'Возраст должен быть числом');
    }),
  check('caloriesPerDay')
    .custom((value) => {
      return numberCheck(value, 'Дневная норма каллорий должны быть числом быть числом');
    }),
];
