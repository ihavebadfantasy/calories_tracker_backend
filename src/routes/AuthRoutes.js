const AuthController = require('../controllers/AuthController');
const validate = require('../middleware/validation/validate');
const registerValidations = require('../middleware/validation/registerValidations');
const loginValidations = require('../middleware/validation/loginValidations');
const refreshValidations = require('../middleware/validation/refreshValidations');

module.exports = (app) => {
  app.post(
    '/api/auth/register',
    validate(registerValidations),
    AuthController.register
  );
  app.post(
    '/api/auth/login',
    validate(loginValidations),
    AuthController.login
  );
  app.post(
    '/api/auth/logout',
    AuthController.logout
  );
  app.post(
    '/api/auth/refresh',
    validate(refreshValidations),
    AuthController.refresh
  );
}
