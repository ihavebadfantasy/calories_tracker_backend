const endOfDay = require('date-fns/endOfDay');
const startOfDay = require('date-fns/startOfDay');
const DailyActivity = require('../models/DailyActivity');
const Day = require('../models/Day');
const User = require('../models/User');
const loadTodayForUser = require('../helpers/loadTodayForUser');

module.exports = {
  async createOne(req, res, next) {
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

      let today = await loadTodayForUser(userId);

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
      next(new Error('Не удалось сохранить. Попробуйте перезагрузить страницу и попробовать еще раз'));
    }
  },

  async updateOne(req, res, next) {
    let updatedDailyActivity;

    const activityId = req.params.id;

    const { userId } = req.body;

    const dailyActivityProps = {
      userId,
    };

    let isCaloriesUpdated = false;

    // adding optional properties
    if (req.body.name) {
      dailyActivityProps.name = req.body.name;
    }
    if (req.body.duration) {
      dailyActivityProps.duration = req.body.duration;
    }
    if (req.body.calories) {
      dailyActivityProps.calories = req.body.calories;
      isCaloriesUpdated = true;
    }

    try {
      // just update the dailyActivity props
      if (!isCaloriesUpdated) {
        await DailyActivity.findOneAndUpdate({ _id: activityId }, dailyActivityProps);
      } else {
        // calories were updated for dailyActivity so need to update the Day also
        const dailyActivity = await DailyActivity.findOne({ _id: activityId });
        const prevActivityCalories = dailyActivity.calories;

        const today = await loadTodayForUser('userId');

        const newCaloriesLeft = today.caloriesLeft - prevActivityCalories + dailyActivityProps.calories;

        const activityUpdate = dailyActivity.update(dailyActivityProps);
        const dayUpdate = today.update({
          caloriesLeft: newCaloriesLeft,
        });
        await Promise.all([activityUpdate, dayUpdate]);
      }

      updatedDailyActivity = await DailyActivity.findOne({ _id: activityId });

      res.send({
        data: {
          dailyActivity: updatedDailyActivity,
        }
      });
    } catch (err) {
      next(new Error('Не удалось обновить. Попробуйте перезагрузить страницу и попробовать еще раз'));
    }
  },

  async deleteOne(req, res, next) {
    const activityId = req.params.id;

    try {
      // loading dailyActivity to get userId
      const dailyActivity = await DailyActivity.findOne({ _id: activityId });

      if (!dailyActivity) {
        throw new Error();
      }

      // loading Day to remove dailyActivity from it
      let today = await loadTodayForUser(dailyActivity.userId);

      if (!today) {
        throw new Error();
      }

      await today.update({
        caloriesLeft: today.caloriesLeft - dailyActivity.calories,
        $pull: { dailyActivities: activityId }
      });

      // deleting daily activity itself
      DailyActivity.delete({ _id: activityId }, (err) => {
        if (err) {
          next(new Error('Не удалось удалить'));
        }

        res.status(204).send();
      });
    } catch (err) {
      next(new Error('Не удалось удалить'));
    }
  }
};
