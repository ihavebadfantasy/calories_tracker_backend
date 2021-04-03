const DailyActivity = require('../models/DailyActivity');
const Day = require('../models/Day');

module.exports = {
  // TODO: add validation
  async createOne(req, res) {
    try {
      // needed in test environment only
      const day = new Day({
        caloriesLeft: 1500,
        userId: req.body.userId,
      });

      await day.save();
    } catch (e) {

    }
  }
};
