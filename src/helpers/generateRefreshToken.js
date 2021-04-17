const jwt = require('jsonwebtoken');

module.exports = (user) => {
  try {
    return jwt.sign({
      id: user._id,
    }, process.env.REFRESH_JWT_SECRET, {
      expiresIn: process.env.REFRESH_JWT_EXPIRATION
    });
  } catch (err) {
    throw new Error();
  }
}
