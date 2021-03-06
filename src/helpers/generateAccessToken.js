const jwt = require('jsonwebtoken');

module.exports = (user) => {
  try {
    return jwt.sign({
      isRegistrationComplete: user.isRegistrationComplete,
      id: user._id,
    }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION
    });
  } catch (err) {
    throw new Error();
  }
}
