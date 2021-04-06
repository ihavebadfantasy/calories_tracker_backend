const { check } = require('express-validator');

module.exports = [
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email обязателен к заполнению и должен быть настоящим email-адресом'),
  check('password')
    .notEmpty()
    .withMessage('Пароль обязателен'),
];
