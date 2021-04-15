const DailyActivity = require('../models/DailyActivity');
const loadTodayForUser = require('../helpers/loadTodayForUser');
const wrapErrorResponse = require('../helpers/wrapErrorResponse');
const generateCustomErr = require('../helpers/generateCustomError');
const createTodayForUser = require('../helpers/createTodayForUser');

module.exports = {
  async createOne(req, res, next) {
    const userId = req.user.id;
    const { calories } = req.body;

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
        today = await createTodayForUser(userId, res);
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
      next(generateCustomErr(req.t('errors.response.saveErr'), err.message));
    }
  },

  async updateOne(req, res, next) {
    let updatedDailyActivity;

    const activityId = req.params.id;

    const userId = req.user.id;

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
        const dailyActivity = await DailyActivity.findOneAndUpdate(
          { _id: activityId, userId },
          dailyActivityProps,
          { runValidators: true }
        );

        if (!dailyActivity) {
          return res.status(404).send(wrapErrorResponse('errors.response.dailyActivityNotFoundErr'));
        }
      } else {
        // calories were updated for dailyActivity so need to update the Day also
        const dailyActivity = await DailyActivity.findOne({ _id: activityId });

        if (!dailyActivity) {
          return res.status(404).send(wrapErrorResponse('errors.response.dailyActivityNotFoundErr'));
        }

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
      next(generateCustomErr(req.t('errors.response.updateErr'), err.message));
    }
  },

  async deleteOne(req, res, next) {
    const activityId = req.params.id;
    const userId = req.user.id;

    try {
      // loading dailyActivity to get userId
      const dailyActivity = await DailyActivity.findOne({ _id: activityId, userId });

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
          throw new Error(err);
        }

        res.status(204).send();
      });
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.deleteErr'), err.message));
    }
  }
};
