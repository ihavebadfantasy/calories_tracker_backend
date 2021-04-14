const wrapErrorResponse = require('../helpers/wrapErrorResponse');

module.exports = (err, req, res) => {
  res.status(400).send(wrapErrorResponse(err.message));
}
