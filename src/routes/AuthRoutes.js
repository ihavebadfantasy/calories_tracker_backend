const AuthController = require('../controllers/AuthController');
const validate = require('../middleware/validation/validate');
const registerValidations = require('../middleware/validation/registerValidations');

module.exports = (app) => {
  app.post('/api/auth/register', validate(registerValidations), AuthController.register);
}
