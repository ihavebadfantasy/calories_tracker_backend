const wrapErrorResponse = require('../helpers/wrapErrorResponse');

module.exports = (err, req, res, next) => {
  res.status(500).send(wrapErrorResponse(err));
}
