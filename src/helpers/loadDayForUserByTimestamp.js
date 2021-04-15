const endOfDay = require('date-fns/endOfDay');
const startOfDay = require('date-fns/startOfDay');
const Day = require('../models/Day');

module.exports = async (userId, timestamp) => {
  try {
    const day = await Day.findOne({
      createdAt: {
        $gte: startOfDay(new Date(timestamp)),
        $lte: endOfDay(new Date(timestamp)),
      },
      userId
    });

    return day;
  } catch(err) {
    throw new Error();
  }
}
