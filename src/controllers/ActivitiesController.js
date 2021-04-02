const Activity = require('../models/Activity');

module.exports = {
  async getAll(req, res) {
    try {
      const activities = await Activity.find();

      res.send({
        data: {
          activities,
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
}
