const startOfDay = require('date-fns/startOfDay');
const Day = require('../models/Day');

module.exports = async (user) => {
  const days = await Day.find({
    userId: user._id,
    statisticsEnabled: true,
    createdAt: {
      $lte: startOfDay(new Date()),
    },
  })
    .populate(['meals', 'dailyActivities']);

  // no need to update stats if no data found
  if (days.length === 0) {
    return;
  }

  const weight = [];
  const calories = [];
  const dailyActivities = [];

  days.forEach((day) => {
    if (day.weight) {
      weight.push(day.weight);
    }

    let dayCalories = 0;
    let dayDailyActivities = 0;

    day.dailyActivities.forEach((activity) => {
      if (activity.duration) {
        dayDailyActivities += activity.duration;
      }
    });

    day.meals.forEach((meal) => {
      if (meal.calories) {
        dayCalories += meal.calories;
      }
    });

    if (dayCalories) {
      calories.push(dayCalories);
    }

    if (dayDailyActivities) {
      dailyActivities.push(dayDailyActivities);
    }
  });

  const averageWeight = getAverage(weight, days.length);
  const averageCaloriesPerDay = getAverage(calories, days.length);
  const averageActivityPerDay = getAverage(dailyActivities, days.length);

  user.stats = {
    averageWeight: averageWeight || user.weight,
    averageActivityPerDay,
    averageCaloriesPerDay
  }

  await user.save();
}

const getAverage = (arr, divisor) => {
  if (arr.length === 0) {
    return null;
  }

  return arr.reduce((acc, currentVal) => acc + currentVal) / divisor;
}

