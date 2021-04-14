const Activity = require('../models/Activity');
const generateCustomErr = require('../helpers/generateCustomError');

module.exports = {
  async getAll(req, res, next) {
    try {
      const activities = await Activity.find({});

      res.send({
        data: {
          activities,
        }
      });
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.activitiesLoadErr'), err.message));
    }
  }
}
