module.exports = (err, extra = {}) => {
  return {
    error: {
      message: err.message,
      body: err.body || null,
      ...extra
    }
  };
}
