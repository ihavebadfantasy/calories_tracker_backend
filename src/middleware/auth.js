const jwt = require('jsonwebtoken');
const wrapErrorResponse = require('../helpers/wrapErrorResponse');

module.exports = (config) => {
  config.ignorePaths = config.ignorePaths || [];

  return (req, res, next) => {
    if (config.ignorePaths.includes(req.url)) {
      return next();
    }

    try {
      const token = req.header('Authorization').replace('Bearer ', '');

      let decoded;
      if (config.refreshPath && config.refreshPath === req.url) {
        decoded = jwt.verify(token, config.secret, {
          ignoreExpiration: true,
        });
      } else {
        decoded = jwt.verify(token, config.secret);
      }

      req.token = token;
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).send(wrapErrorResponse(new Error(req.t('errors.response.unauthorizedErr'))));
    }
  }
}
