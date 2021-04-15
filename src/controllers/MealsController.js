const Meal = require('../models/Meal');
const Day = require('../models/Day');
const User = require('../models/User');
const loadTodayForUser = require('../helpers/loadTodayForUser');
const wrapErrorResponse = require('../helpers/wrapErrorResponse');
const generateCustomErr = require('../helpers/generateCustomError');

module.exports = {
  async createOne(req, res, next) {
    const userId = req.user.id;
    const { calories } = req.body;

    const mealProps = {
      calories,
      userId,
    };

    // adding optional properties
    if (req.body.nutriment) {
      mealProps.nutriment = req.body.nutriment;
    }

    try {
      // saving dailyActivity itself
      const meal = new Meal(mealProps);
      await meal.save();

      let today = await loadTodayForUser(userId);

      // creating current day if not exists
      if (!today) {
        const user = await User.findOne({ _id: userId });

        if (!user) {
          return res.status(404).send(wrapErrorResponse('errors.response.userNotFoundErr'));
        }

        today = new Day({
          caloriesLeft: user.caloriesPerDay,
          userId: user._id
        });

        await today.save();
      }

      // updating current day caloriesLeft and meals
      today.meals.push(meal._id);
      today.caloriesLeft -= meal.calories;

      await today.save();

      res.send({
        data: {
          meal,
        }
      });
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.saveErr'), err.message));
    }
  },

  async updateOne(req, res, next) {
    let updatedMeal;

    const mealId = req.params.id;

    const userId = req.user.id;

    const mealProps = {};

    let isCaloriesUpdated = false;

    // adding optional properties
    if (req.body.nutriment) {
      mealProps.nutriment = req.body.nutriment;
    }
    if (req.body.calories) {
      mealProps.calories = req.body.calories;
      isCaloriesUpdated = true;
    }

    try {
      // just update the meal props
      if (!isCaloriesUpdated) {
        const meal = await Meal.findOneAndUpdate({ _id: mealId, userId }, mealProps);

        if (!meal) {
          return res.status(404).send(wrapErrorResponse('errors.response.mealNotFoundErr'));
        }
      } else {
        // calories were updated for meal so need to update the Day also
        const meal = await Meal.findOne({ _id: mealId });

        if (!meal) {
          return res.status(404).send(wrapErrorResponse('errors.response.mealNotFoundErr'));
        }

        const prevMealCalories = meal.calories;

        const today = await loadTodayForUser(userId);

        const newCaloriesLeft = today.caloriesLeft + prevMealCalories - mealProps.calories;

        const mealUpdate = meal.update(mealProps);
        const dayUpdate = today.update({
          caloriesLeft: newCaloriesLeft,
        });
        await Promise.all([mealUpdate, dayUpdate]);
      }

      updatedMeal = await Meal.findOne({ _id: mealId });

      res.send({
        data: {
          meal: updatedMeal,
        }
      });
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.updateErr'), err.message));
    }
  },

  async deleteOne(req, res, next) {
    const mealId = req.params.id;
    const userId = req.user.id;

    try {
      // loading meal to get userId
      const meal = await Meal.findOne({ _id: mealId, userId });

      if (!meal) {
        return res.status(404).send(wrapErrorResponse('errors.response.mealNotFoundErr'));
      }

      // loading Day to remove dailyActivity from it
      let today = await loadTodayForUser(meal.userId);

      if (!today) {
        throw new Error();
      }

      await today.update({
        caloriesLeft: today.caloriesLeft + meal.calories,
        $pull: { meals: mealId }
      });

      // deleting meal itself
      Meal.delete({ _id: mealId }, (err) => {
        if (err) {
          throw new Error();
        }

        res.status(204).send();
      });
    } catch (err) {
      next(generateCustomErr(req.t('errors.response.deleteErr'), err.message));
    }
  }
};
