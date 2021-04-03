require('dotenv').config();

const app = require('./src/app');

app.listen(process.env.PORT, () => {
  console.log('Running on port 3050');
})
