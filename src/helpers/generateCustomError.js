module.exports = (msg, body = null) => {
  const err = new Error(msg);
  err.body = body;

  return err;
}
