const ActivitiesController = require('../controllers/ActivitiesController');

module.exports = (app) => {
  app.get('/api/activities', ActivitiesController.getAll);
}
