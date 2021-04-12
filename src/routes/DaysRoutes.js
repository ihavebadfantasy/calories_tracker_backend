const DaysController = require('../controllers/DaysController');
const validate = require('../middleware/validation/validate');
const updateDayValidation = require('../middleware/validation/updateDayValidations');
const updateManyDaysValidation = require('../middleware/validation/updateManyDaysValidations');

module.exports = (app) => {
  app.get(
    '/api/days',
    DaysController.getAll
  );
  app.get(
    '/api/days/:id',
    DaysController.getOne
  );
  app.put('/api/days/:id',
    validate(updateDayValidation),
    DaysController.updateOne
  );
  app.put(
    '/api/days',
    validate(updateManyDaysValidation),
    DaysController.updateMany
  );
};
