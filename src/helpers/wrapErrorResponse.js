module.exports = (err) => {
  return {
    error: {
      message: err.message,
      body: err.body || null,
    }
  };
}
