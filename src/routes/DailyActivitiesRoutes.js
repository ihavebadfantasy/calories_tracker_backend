const DailyActivitiesController = require('../controllers/DailyActivitiesController');

module.exports = (app) => {
  app.post('/api/daily-activities', DailyActivitiesController.createOne);
}
