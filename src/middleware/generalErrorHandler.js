module.exports = (err, req, res, next) => {
  res.status(400).send({
    error: {
      message: err.message,
    }
  });
}
