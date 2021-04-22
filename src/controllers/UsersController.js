const User = require('../models/User');
const loadTodayForUser = require('../helpers/loadTodayForUser');
const wrapErrorResponse = require('../helpers/wrapErrorResponse');
const generateCustomErr = require('../helpers/generateCustomError');
const generateMailingToken = require('../helpers/generateMailingToken');
const Mailer = require('../mailer/Mailer');
const Encryptor = require('../helpers/Encryptor');

const encryptor = new Encryptor();

module.exports = {
  async getOne(req, res) {
    const { id } = req.user;

    try {
      let user = await User.findOne({ _id: id });

      if (!user) {
        return res.status(404).send(wrapErrorResponse('errors.response.userNotFoundErr'));
      }

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
      const emailConfirmationToken = generateMailingToken();
      const emailConfirmationTokenHash = await encryptor.hash(emailConfirmationToken);

      const updRes = await User.findOneAndUpdate(
        { _id: id },
        {
          username,
          weight,
          age,
          caloriesPerDay,
          stats,
          isRegistrationComplete: true,
          emailConfirmationToken: emailConfirmationTokenHash,
        },
        {
          runValidators: true,
        }
      );

      if (!updRes) {
        return res.status(404).send(wrapErrorResponse('errors.response.userNotFoundErr'));
      }

      user = await User.findOne({ _id: id });

      Mailer.$instance.sendConfirmEmail(req, user, emailConfirmationToken);

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

      res.send({
        data: updatedUser,
      });
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.updateErr'), err.message));
    }
  },

  async confirmEmail(req, res, next) {
    const { token, id } = req.body;

    try {
      const user = await User.findOne({ _id: id });
      if (!user) {
        return res.status(401).send(wrapErrorResponse(new Error(req.t('errors.response.loginCredentialsErr'))));
      }

      const isRightToken = await encryptor.compare(token, user.emailConfirmationToken);
      if (!isRightToken) {
        return res.status(422).send(wrapErrorResponse(new Error(req.t('errors.response.emailConfirmationTokenErr'))));
      }

      user.isEmailConfirmed = true;
      user.emailConfirmationToken = null;

      await user.save();

      res.status(200).send({});
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.generalErr'), err.message));
    }
  },

  async updatePassword(req, res, next) {
    const { id } = req.user;
    const { password } = req.body;

    const passwordHash = await encryptor.hash(password);

    try {
      const user = await User.findOneAndUpdate({ _id: id }, {
        password: passwordHash,
        tokens: [],
      });

      if (!user) {
        return res.status(401).send(wrapErrorResponse(new Error(req.t('errors.response.loginCredentialsErr'))));
      }

      res.status(200).send({});
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.createNewPasswordErr'), err.message));
    }
  }

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
