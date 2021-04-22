const UsersController = require('../controllers/UsersController');
const validate = require('../middleware/validation/validate');
const createUserValidations = require('../middleware/validation/createUserValidations');
const confirmEmailValidations = require('../middleware/validation/confirmEmailValidations');
const updatePasswordValidations = require('../middleware/validation/updatePasswordValidations');
const updateUserValidations = require('../middleware/validation/updateUserValidations');

module.exports = (app) => {
  app.get(
    '/api/users',
    UsersController.getOne
  );
  app.put(
    '/api/users',
    validate(updateUserValidations),
    UsersController.updateOne
  );
  app.post(
    '/api/users',
    validate(createUserValidations),
    UsersController.createOne
  );
  app.post(
    '/api/users/confirm-email',
    validate(confirmEmailValidations),
    UsersController.confirmEmail
  );
  app.post(
    '/api/users/update-password',
    validate(updatePasswordValidations),
    UsersController.updatePassword
  );
  // app.delete('/api/users', UsersController.deleteOne);
}
