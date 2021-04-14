const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const routes = require('./routes');
const generalErrorHandler = require('./middleware/generalErrorHandler');
const authorizationErrorHandler = require('./middleware/authorizationErrorHandler');
const i18n = require('./i18n');

switch (process.env.NODE_ENV) {
  case 'test':
    mongoose.connect(
      `mongodb://localhost/${process.env.TEST_DB_NAME}`,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
      }
     );
    break;
  case 'prod':
    mongoose.connect(
      `mongodb://localhost/${process.env.PROD_DB_NAME}`,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
      }
    );
    break;
  case 'dev':
    mongoose.connect(`mongodb://localhost/${process.env.DEV_DB_NAME}`,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
      }
    );
    break;
}

const app = express();

app.use(i18n.init);
app.use(bodyParser.json());

app.use(jwt({
  secret: process.env.JWT_SECRET,
  algorithms: [process.env.JWT_ALGHORITMS],
})
  .unless({
    path: [
      '/api/auth/login',
      '/api/auth/register'
    ]
  })
);
app.use(authorizationErrorHandler);

routes(app);

app.use(generalErrorHandler);

module.exports = app;
