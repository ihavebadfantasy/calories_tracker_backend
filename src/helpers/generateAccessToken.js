const jwt = require('jsonwebtoken');

module.exports = (user) => {
  try {
    return jwt.sign({
      username: user.username,
      isRegistrationComplete: user.isRegistrationComplete,
      email: user.email,
      id: user._id,
    }, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error();
  }
}
