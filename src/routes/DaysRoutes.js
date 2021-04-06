const jwt = require('express-jwt');
const DaysController = require('../controllers/DaysController');
const validate = require('../middleware/validation/validate');
const updateDayValidation = require('../middleware/validation/updateDayValidations');
const idCheck = require('../middleware/validation/idCheck');
module.exports = (app) => {
  app.get(
    '/api/days',
    jwt({
      secret: process.env.JWT_SECRET,
      algorithms: [process.env.JWT_ALGHORITMS],
    }),
    DaysController.getAll
  );
  app.get(
    '/api/days/:id',
    jwt({
      secret: process.env.JWT_SECRET,
      algorithms: [process.env.JWT_ALGHORITMS],
    }),
    DaysController.getOne
  );
  app.put('/api/days/:id',
    idCheck('userId'),
    validate(updateDayValidation),
    DaysController.updateOne
  );
  // TODO: add validation
  app.put('/api/days/:id', DaysController.updateMany);
};
