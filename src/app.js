const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const generalErrorHandler = require('./middleware/generalErrorHandler');

switch (process.env.NODE_ENV) {
  case 'test':
    mongoose.connect(`mongodb://localhost/${process.env.TEST_DB_NAME}`);
    break;
  case 'prod':
    mongoose.connect(`mongodb://localhost/${process.env.PROD_DB_NAME}`);
    break;
  case 'dev':
    mongoose.connect(`mongodb://localhost/${process.env.DEV_DB_NAME}`);
    break;
}

const app = express();

app.use(bodyParser.json());

routes(app);

app.use(generalErrorHandler);

module.exports = app;
