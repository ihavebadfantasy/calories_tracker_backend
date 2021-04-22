const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const i18n = require('./i18n');
const config = require('./config');
const routes = require('./routes');
const generalErrorHandler = require('./middleware/generalErrorHandler');
const auth = require('./middleware/auth');

switch (process.env.NODE_ENV) {
  case 'test':
    mongoose.connect(
      `mongodb://localhost/${process.env.TEST_DB_NAME}`,
      config.mongoose.connection
     );
    break;
  case 'prod':
    mongoose.connect(
      `mongodb://localhost/${process.env.PROD_DB_NAME}`,
      config.mongoose.connection
    );
    break;
  case 'dev':
    mongoose.connect(`mongodb://localhost/${process.env.DEV_DB_NAME}`,
      config.mongoose.connection
    );
    break;
}

const app = express();

app.use(cors())
app.use(i18n.init);
app.use(bodyParser.json());

app.use(auth({
  secret: process.env.JWT_SECRET,
  ignorePaths: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/create-new-password'
  ],
  refreshPath: '/api/auth/refresh'
}));

routes(app);

app.use(generalErrorHandler);

module.exports = app;
