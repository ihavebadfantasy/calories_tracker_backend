const ExpressBrute = require('express-brute');
const store = require('./store');
const setRetryAfterHeader = require('./setRetryAfterHeader');
const wrapErrorResponse = require('../../helpers/wrapErrorResponse');

const config = {
  freeRetries: 5,
  minWait: 5*60*1000, // 5 minutes
}

const failCallback = (req, res, next, nextValidRequestDate) => {
  setRetryAfterHeader(res, nextValidRequestDate);

  const resBody = wrapErrorResponse(new Error(req.t('errors.response.tooManyRequestsErr')), {
    nextValidRequestDate: nextValidRequestDate,
  })
  res.status(429).send(resBody);
}

module.exports = new ExpressBrute(store, {
  ...config,
  failCallback,
});

