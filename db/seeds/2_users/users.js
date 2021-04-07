const Encryptor = require('../../../src/helpers/Encryptor');

const encryptor = new Encryptor();

module.exports = [
  // {
  //   username: 'ihavebadfantasy',
  //   email: 'ihavebadfantasy@protonmail.com',
  //   password: encryptor.hashSync('password01'),
  //   weight: 47,
  //   age: 27,
  //   caloriesPerDay: 1500,
  //   isRegistrationComplete: false,
  //   stats: {
  //     averageWeight: 47,
  //     averageCaloriesPerDay: 0,
  //     averageActivityPerDay: 0,
  //   }
  // },
  {
    username: 'iamworried',
    email: 'm@m.com',
    password: encryptor.hashSync('password02'),
    weight: 55,
    age: 66,
    caloriesPerDay: 5600,
    averageWeight: 77,
    averageCaloriesPerDay: 0,
    averageActivityPerDay: 0,
    isRegistrationComplete: false,
  },
]
