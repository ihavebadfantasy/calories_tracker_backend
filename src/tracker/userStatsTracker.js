const updateUserStats = require('./updateUserStats');
const User = require('../models/User');

module.exports = async () => {
  const users = await User.find({ isRegistrationComplete: true });

  users.forEach((user) => {
    updateUserStats(user);
  });
}
