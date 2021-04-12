const wrapErrorResponse = require('../helpers/wrapErrorResponse');

module.exports = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send(wrapErrorResponse(req.t('errors.response.unauthorizedErr')));
  } else {
    next(err);
  }
}
