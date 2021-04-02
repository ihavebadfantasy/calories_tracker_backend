const Encryptor = require('../../../src/helpers/Encryptor');

const encryptor = new Encryptor();

module.exports = [
  {
    username: 'ihavebadfantasy',
    email: 'ihavebadfantasy@protonmail.com',
    password: encryptor.hashSync('password01'),
    weight: 47,
    age: 27,
    caloriesPerDay: 1500,
    averageWeight: 47,
    averageCaloriesPerDay: 0,
    averageActivityPerDay: 0,
  },
]
