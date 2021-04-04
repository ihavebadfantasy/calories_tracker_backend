const { check } = require('express-validator');
const numberCheck = require('./numberCheck');

module.exports = [
  check('username')
    .notEmpty()
    .withMessage('Введите имя или никнейм'),
  check('weight')
    .notEmpty()
    .withMessage('Укажите свой вес')
    .custom((value) => {
      return numberCheck(value, 'Вес должен быть числом');
    }),
  check('age')
    .notEmpty()
    .withMessage('Укажите свой возраст')
    .custom((value) => {
      return numberCheck(value, 'Возраст должен быть числом');
    }),
  check('caloriesPerDay')
    .notEmpty()
    .withMessage('Укажите дневную норму калорий')
    .custom((value) => {
      return numberCheck(value, 'Дневная норма каллорий должны быть числом быть числом');
    }),
];
