const endOfDay = require('date-fns/endOfDay');
const startOfDay = require('date-fns/startOfDay');
const DailyActivity = require('../models/DailyActivity');
const Day = require('../models/Day');
const User = require('../models/User');

module.exports = {
  async createOne(req, res) {
    const { calories, userId } = req.body;

    const dailyActivityProps = {
      calories,
      userId,
    };

    // adding optional properties
    if (req.body.name) {
      dailyActivityProps.name = req.body.name;
    }
    if (req.body.duration) {
      dailyActivityProps.duration = req.body.duration;
    }

    try {
      // saving dailyActivity itself
      const dailyActivity = new DailyActivity(dailyActivityProps);
      await dailyActivity.save();

      // querying today to save daily activity for users's current day
      let today = await Day.findOne({
        createdAt: {
          $gte: startOfDay(new Date()),
          $lte: endOfDay(new Date()),
        },
        userId
      });

      console.log(today);
      // creating current day if not exists
      if (!today) {
        const user = await User.findOne({ _id: userId });

        if (!user) {
          throw new Error();
        }

        today = new Day({
          caloriesLeft: user.caloriesPerDay,
          userId: user._id
        });

        await today.save();
      }

      // updating current day caloriesLeft and dailyActivities
      today.dailyActivities.push(dailyActivity._id);
      today.caloriesLeft += dailyActivity.calories;

      await today.save();

      res.send({
        data: {
          dailyActivity,
        }
      });
    } catch (err) {
      console.warn(err);
    }
  }
};
