const wrapErrorResponse = require('../helpers/wrapErrorResponse');

module.exports = (err, req, res) => {
  res.status(500).send(wrapErrorResponse(error.message));
}
