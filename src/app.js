const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
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
      process.env.MONGODB_URL,
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
app.use(favicon(process.cwd() + '/public/favicon.ico'));
app.use(express.static(path.join(process.cwd(), 'public')));
console.log(path.join(process.cwd(), 'public'));

app.use(cors())
app.use(i18n.init);
app.use(bodyParser.json());

app.use(auth({
  secret: process.env.JWT_SECRET,
  ignorePaths: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/create-new-password',
    '/api/users/confirm-email'
  ],
  refreshPath: '/api/auth/refresh'
}));

routes(app);

app.use(generalErrorHandler);

module.exports = app;
