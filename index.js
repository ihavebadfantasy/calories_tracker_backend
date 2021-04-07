require('dotenv').config();
const schedule = require('node-schedule');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const userStatsTracker = require('./src/tracker/userStatsTracker');
const Logger = require('./logs/Logger');
const app = require('./src/app');

const updateStatsJobLogger = new Logger('updateStats');

const userStatsUpdateJob = schedule.scheduleJob('1 0 0 * * *', userStatsTracker);
userStatsUpdateJob.on('error', (err) => {
  updateStatsJobLogger.errorLog(err);
});


app.listen(process.env.PORT, () => {
  console.log('Running on port 3050');
});

