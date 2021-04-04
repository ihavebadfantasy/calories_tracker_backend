module.exports = (fieldName) => {
  return (req, res, next) => {
    if (!req.body[fieldName]) {
      res.status(400).send({
        error: {
          message: 'Ну и где айдишник юзера? =/'
        }
      });
    }

    next();
  }
}
