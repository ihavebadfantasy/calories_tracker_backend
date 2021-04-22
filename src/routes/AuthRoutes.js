const AuthController = require('../controllers/AuthController');
const validate = require('../middleware/validation/validate');
const registerValidations = require('../middleware/validation/registerValidations');
const loginValidations = require('../middleware/validation/loginValidations');
const refreshValidations = require('../middleware/validation/refreshValidations');
const authRateLimiter = require('../middleware/rateLimiter/authRateLimiter');
const forgotPasswordValidations = require('../middleware/validation/forgotPasswordValidations');
const createNewPasswordValidations = require('../middleware/validation/createNewPasswordValidations');

module.exports = (app) => {
  app.post(
    '/api/auth/register',
    validate(registerValidations),
    AuthController.register
  );
  app.post(
    '/api/auth/login',
    authRateLimiter.prevent,
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
  app.post(
    '/api/auth/forgot-password',
    validate(forgotPasswordValidations),
    AuthController.forgotPassword
  );
  app.post(
    '/api/auth/create-new-password',
    validate(createNewPasswordValidations),
    AuthController.createNewPassword
  );
}
