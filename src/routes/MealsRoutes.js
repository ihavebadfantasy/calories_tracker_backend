const MealsController = require('../controllers/MealsController');
const validate = require('../middleware/validation/validate');
const createMealsValidation = require('../middleware/validation/createMealsValidations');
const updateMealsValidation = require('../middleware/validation/updateMealsValidations');

module.exports = (app) => {
  app.post(
    '/api/meals',
    validate(createMealsValidation),
    MealsController.createOne
  );
  app.put(
    '/api/meals/:id',
    validate(updateMealsValidation),
    MealsController.updateOne
  );
  app.delete(
    '/api/meals/:id',
    MealsController.deleteOne
  );
}
