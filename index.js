require('dotenv').config();

const app = require('./src/app');

app.listen(3050, () => {
  console.log('Running on port 3050');
})
