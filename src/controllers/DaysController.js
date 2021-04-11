const Day = require('../models/Day');

module.exports = {
  async getAll(req, res, next) {
    const { user } = req;

    try {
      const days = await Day.find({ userId: user.id })
        .populate('dailyActivities')
        .populate('meals');

      res.send({
        data: {
          days,
        }
      });
    } catch (err) {
      next(new Error(req.t('errors.response.daysLoadErr')))
    }
  },

  async getOne(req, res, next) {
    const _id = req.params.id;

    try {
      const day = await Day.findOne({ _id })
        .populate('dailyActivities')
        .populate('meals');

      res.send({
        data: {
          day,
        }
      });
    } catch (err) {
      next(new Error(req.t('errors.response.dayLoadErr')));
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

    if (req.body.statisticsEnabled) {
      dayProps.statisticsEnabled = req.body.statisticsEnabled;
      statisticsEnabledChanged = true;
    }

    try {
      // just a simple Day update
      if (!statisticsEnabledChanged) {
        const day = await Day.findOneAndUpdate({ _id: dayId }, dayProps);

        if (!day) {
          throw new Error();
        }

        const updatedDay = await Day.findOne({ _id: dayId });

        res.send({
          data: {
            day: updatedDay,
          }
        });
      }

      // if statisticsEnabled flag has been changed need also to re-count stats for user
    } catch (err) {
      next(new Error(req.t('errors.response.uploadErr')));
    }
  },

  async updateMany() {

  }
};
