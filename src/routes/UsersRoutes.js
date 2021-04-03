const UsersController = require('../controllers/UsersController');

module.exports = (app) => {
  app.get('/api/users/:id', UsersController.getOne);
  app.get('/api/users', UsersController.getAll);
  app.put('/api/users/:id', UsersController.updateOne);
  app.delete('/api/users/:id', UsersController.deleteOne);
}
