const DailyActivitiesController = require('../controllers/DailyActivitiesController');
const idCheck = require('../middleware/validation/idCheck');
const validate = require('../middleware/validation/validate');
const dailyActivityCreateValidation = require('../middleware/validation/dailyActivityCreateValidations');

module.exports = (app) => {
  app.post('/api/daily-activities', idCheck('userId'), validate(dailyActivityCreateValidation), DailyActivitiesController.createOne);
}
