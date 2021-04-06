const DailyActivitiesController = require('../controllers/DailyActivitiesController');
const validate = require('../middleware/validation/validate');
const dailyActivityCreateValidation = require('../middleware/validation/dailyActivityCreateValidations');
const dailyActivityUpdateValidation = require('../middleware/validation/dailyActivityUpdateValidations');

module.exports = (app) => {
  app.post(
    '/api/daily-activities',
    validate(dailyActivityCreateValidation),
    DailyActivitiesController.createOne
  );
  app.put(
    '/api/daily-activities/:id',
    validate(dailyActivityUpdateValidation),
    DailyActivitiesController.updateOne
  );
  app.delete(
    '/api/daily-activities/:id',
    DailyActivitiesController.deleteOne
  );
}
