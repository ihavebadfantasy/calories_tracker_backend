require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const app = require('./src/app');

app.listen(process.env.PORT, () => {
  console.log('Running on port 3050');
})
