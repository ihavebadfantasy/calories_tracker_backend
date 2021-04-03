const UsersController = require('../controllers/UsersController');
const validate = require('../middleware/validation/validate');
const createUserValidations = require('../middleware/validation/createUserValidations');

module.exports = (app) => {
  app.get('/api/users/:id', UsersController.getOne);
  app.get('/api/users', UsersController.getAll);
  app.put('/api/users/:id', UsersController.updateOne);
  app.post('/api/users/:id', validate(createUserValidations), UsersController.createOne);
  app.delete('/api/users/:id', UsersController.deleteOne);
}
