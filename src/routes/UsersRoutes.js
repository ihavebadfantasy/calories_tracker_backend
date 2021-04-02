const UsersController = require('../controllers/UsersController');

module.exports = (app) => {
  app.get('/api/users/:id', UsersController.getOne);
  app.put('/api/users/:id', UsersController.updateOne);
}
