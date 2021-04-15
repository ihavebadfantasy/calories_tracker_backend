const jwt = require('jsonwebtoken');
const User = require('../models/User');
const wrapErrorResponse = require('../helpers/wrapErrorResponse');

module.exports = (config) => {
  config.ignorePaths = config.ignorePaths || [];
  console.log('in auth');

  return (req, res, next) => {
    if (config.ignorePaths.includes(req.url)) {
      next();
    }

    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, config.secret);

      req.token = token;
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).send(wrapErrorResponse(req.t('errors.response.unauthorizedErr')));
    }
  }
}
