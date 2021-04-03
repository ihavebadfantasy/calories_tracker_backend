const { check } = require('express-validator');

module.exports = [
  check('username')
    .notEmpty()
    .withMessage('Введите имя или никнейм'),
  check('weight')
    .notEmpty()
    .withMessage('Укажите свой вес')
    .custom((value) => {
      if (isNaN(parseFloat(value))) {
        throw new Error('Вес должен быть числом')
      } else {
        return true;
      }
    }),
  check('age')
    .notEmpty()
    .withMessage('Укажите свой возраст')
    .custom((value) => {
      if (isNaN(parseFloat(value))) {
        throw new Error('Возраст должен быть числом')
      } else {
        return true;
      }
    }),
  check('caloriesPerDay')
    .notEmpty()
    .withMessage('Укажите дневную норму калорий')
    .custom((value) => {
      if (isNaN(parseFloat(value))) {
        throw new Error('Дневная норма каллорий должны быть числом быть числом')
      } else {
        return true;
      }
    }),
];
