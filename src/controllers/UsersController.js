const User = require('../models/User');
const loadTodayForUser = require('../helpers/loadTodayForUser');
const wrapErrorResponse = require('../helpers/wrapErrorResponse');
const generateCustomErr = require('../helpers/generateCustomError');

module.exports = {
  async getOne(req, res) {
    const { id } = req.user;

    try {
      let user = await User.findOne({ _id: id });

      if (!user) {
        return res.status(404).send(wrapErrorResponse('errors.response.userNotFoundErr'));
      }

      user = user.toObject();
      delete user.password;

      res.send({
        data: {
          user
        }
      });
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.userProfileErr'), err.message));
    }
  },

  async createOne(req, res, next) {
    const { id } = req.user;
    const { username, weight, age, caloriesPerDay } = req.body;
    let user;

    const stats = {
      averageWeight: weight,
    };

    try {
      const updRes = await User.findOneAndUpdate(
        { _id: id },
        {
          username,
          weight,
          age,
          caloriesPerDay,
          stats,
          isRegistrationComplete: true,
        },
        {
          runValidators: true,
        }
      );

      if (!updRes) {
        return res.status(404).send(wrapErrorResponse('errors.response.userNotFoundErr'));
      }

      user = await User.findOne({ _id: id });

      user = user.toObject();
      delete user.password;

      res.send({
        data: {
          user,
        }
      });
    } catch(err) {
      next(generateCustomErr(req.t('errors.response.userProfileSaveErr'), err.message));
    }
  },

  async updateOne(req, res, next) {
    const { id } = req.user;

    let isCaloriesPerDayChanged = false;

    const userProps = {};
    for (let key in req.body) {
      if (key === 'username' || key === 'email' || key === 'weight' || key === 'age') {
        userProps[key] = req.body[key];
      } else if (key === 'caloriesPerDay') {
        userProps[key] = req.body[key];
        isCaloriesPerDayChanged = true;
      }
    }

    try {
      // handle caloriesPerDay change for current day
      if (isCaloriesPerDayChanged) {
        const user = await User.findOne({ _id: id });

        if (!user) {
          return res.status(404).send(wrapErrorResponse('errors.response.userNotFoundErr'));
        }

        const today = await loadTodayForUser(id);

        // if today is not created yet no need to update it
        if (today) {
          const prevCaloriesPerDay = user.caloriesPerDay;
          const caloriesPerDayDifference = userProps.caloriesPerDay - prevCaloriesPerDay;

          await today.update({
            caloriesLeft: today.caloriesLeft + caloriesPerDayDifference,
          });
        }
      }

      await User.updateOne({ _id: id }, userProps);

      let updatedUser = await User.findOne({ _id: id });

      updatedUser = updatedUser.toObject();
      delete updatedUser.password;

      res.send({
        data: updatedUser,
      });
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.updateErr'), err.message));
    }
  },

  // uncomment and add deletion of meals, dailyActivities and days connected to user if need user delete
  // deleteOne(req, res) {
  //   const id = req.params.id;
  //
  //   User.delete({ _id: id }, (err) => {
  //     if (err) {
  //       return res.status(400).send({error: {
  //         message: 'Не удалось удалить'
  //         }
  //       });
  //     }
  //
  //     res.status(204).send();
  //   });
  // }
}
