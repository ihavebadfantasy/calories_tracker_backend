module.exports = (res, nextValidReqDate) => {
  const secUntilNextReq = Math.ceil((nextValidReqDate.getTime() - Date.now())/1000);
  res.header('Retry-After', secUntilNextReq);
}
