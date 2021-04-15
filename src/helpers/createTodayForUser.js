const User = require('../models/User');
const Day = require('../models/Day');
const wrapErrorResponse = require('./wrapErrorResponse');

module.exports = async (userId, res) => {
  const user = await User.findOne({ _id: userId });

  if (!user) {
    return res.status(404).send(wrapErrorResponse('errors.response.userNotFoundErr'));
  }

  const today = new Day({
    caloriesLeft: user.caloriesPerDay,
    userId: user._id
  });

  await today.save();

  return today;
}
