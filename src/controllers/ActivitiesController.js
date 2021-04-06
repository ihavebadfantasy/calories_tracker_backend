const Activity = require('../models/Activity');

module.exports = {
  async getAll(req, res, next) {
    try {
      const activities = await Activity.find();

      res.send({
        data: {
          activities,
        }
      });
    } catch (err) {
      next(new Error('не удалось загрузить виды физической активности. Попробуйте перезагрузить страницу'));
    }
  }
}
