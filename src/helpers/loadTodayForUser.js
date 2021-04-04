const endOfDay = require('date-fns/endOfDay');
const startOfDay = require('date-fns/startOfDay');
const Day = require('../models/Day');

module.exports = async (userId) => {
  try {
    const today = await Day.findOne({
      createdAt: {
        $gte: startOfDay(new Date()),
        $lte: endOfDay(new Date()),
      },
      userId
    });

    return today;
  } catch(err) {
    throw new Error();
  }
}
