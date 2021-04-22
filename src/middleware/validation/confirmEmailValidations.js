const { check } = require('express-validator');

module.exports = [
  check('id')
    .notEmpty(),
  check('token')
    .notEmpty(),
];
