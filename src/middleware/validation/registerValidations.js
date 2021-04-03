const { check } = require('express-validator');
const User = require('../../models/User');

module.exports = [
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email обязателен к заполнению и должен быть настоящим email-адресом')
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('Пользователем с такой почтой уже сущестует');
      } else {
        return true;
      }
    }),
  check('password')
    .isLength({ min: 5 })
    .withMessage('Пароль должен содержать минимум 5 символов'),
  check('passwordConfirmation')
    .custom((value, { req }) => {
      if(value !== req.body.password) {
        throw new Error('Подтверждение пароля обязательно и должно совпадать с паролем');
      } else {
        return true;
      }
    })
];
