const Day = require('../models/Day');
const User = require('../models/User');
const updateUserStats = require('../tracker/updateUserStats');
const wrapErrorResponse = require('../helpers/wrapErrorResponse');
const generateCustomErr = require('../helpers/generateCustomError');
const createTodayForUser = require('../helpers/createTodayForUser');

module.exports = {
  async getAll(req, res, next) {
    const { id: userId } = req.user;

    try {
      const days = await Day.find({ userId })
        .populate(['dailyActivities', 'meals']);

      res.send({
        data: {
          days,
        }
      });
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.daysLoadErr'), err.message));
    }
  },

  async getOne(req, res, next) {
    const _id = req.params.id;
    const { id: userId } = req.user;

    try {
      const day = await Day.findOne({ _id, userId })
        .populate('dailyActivities')
        .populate('meals');

      if (!day) {
        return res.status(404).send(wrapErrorResponse('errors.response.dayNotFoundErr'));
      }

      res.send({
        data: {
          day,
        }
      });
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.dayLoadErr'), err.message));
    }
  },

  async createToday(req, res, next) {
    const userId = req.user.id;

    try {
      await createTodayForUser(userId, res);
      res.status(201).send();
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.saveErr'), err.message));
    }
  },

  async updateOne(req, res, next) {
    const dayId = req.params.id;

    const dayProps = {};
    let statisticsEnabledChanged = false;
    const { id: userId } = req.user;

    if (req.body.weight) {
      dayProps.weight = req.body.weight;
    }

    if ('statisticsEnabled' in req.body) {
      dayProps.statisticsEnabled = req.body.statisticsEnabled;
      statisticsEnabledChanged = true;
    }

    try {
      // just a simple Day update
      const day = await Day.findOneAndUpdate(
        { _id: dayId, userId },
        dayProps,
        { runValidators: true }
      );

      if (!day) {
        return res.status(404).send(wrapErrorResponse('errors.response.dayNotFoundErr'));
      }

      // if statisticsEnabled flag has been changed need also to re-count stats for user
      if (statisticsEnabledChanged) {
        const user = await User.findOne({ _id: userId });
        if (!user) {
          return res.status(404).send(wrapErrorResponse('errors.response.userNotFoundErr'));
        }

        await updateUserStats(user);
      }

      const updatedDay = await Day.findOne({ _id: dayId, userId }).populate(['dailyActivities', 'meals']);;

      res.send({
        data: {
          day: updatedDay,
          statsUpdated: statisticsEnabledChanged,
        }
      });
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.updateErr'), err.message));
    }
  },

  async updateMany(req, res, next) {
    const { daysIds, statisticsEnabled } = req.body;
    const { id: userId } = req.user;

    try {
      const days = await Day.updateMany(
        { _id: { $in: daysIds }, userId },
        { statisticsEnabled },
        {
          runValidators: true,
        }
      );

      if(!days || days.length < 1) {
        return res.status(404).send(wrapErrorResponse('errors.response.dayNotFoundErr'));
      }

      // update user stats
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send(wrapErrorResponse('errors.response.userNotFoundErr'));
      }

      await updateUserStats(user);

      res.status(200).send();
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.updateErr'), err.message));
    }
  }
};
