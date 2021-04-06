const Meal = require('../models/Meal');
const Day = require('../models/Day');
const User = require('../models/User');
const loadTodayForUser = require('../helpers/loadTodayForUser');

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
          throw new Error();
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
      next(new Error('Не удалось сохранить. Попробуйте перезагрузить страницу и попробовать еще раз'));
    }
  },

  async updateOne(req, res, next) {
    let updatedMeal;

    const mealId = req.params.id;

    const userId = req.user.id;

    const mealProps = {
      userId,
    };

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
        await Meal.findOneAndUpdate({ _id: mealId }, mealProps);
      } else {
        // calories were updated for meal so need to update the Day also
        const meal = await Meal.findOne({ _id: mealId });
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
      console.warn(err);
      // next(new Error('Не удалось обновить. Попробуйте перезагрузить страницу и попробовать еще раз'));
    }
  },

  async deleteOne(req, res, next) {
    const mealId = req.params.id;

    try {
      // loading meal to get userId
      const meal = await Meal.findOne({ _id: mealId });

      if (!meal) {
        throw new Error();
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
          next(new Error('Не удалось удалить'));
        }

        res.status(204).send();
      });
    } catch (err) {
      next(new Error('Не удалось удалить'));
    }
  }
};
