module.exports = (err, req, res) => {
  res.status(400).send({
    error: {
      message: err.message,
    }
  });
}
