const mongoose = require('mongoose');

before((done) => {
  mongoose.connect('mongodb://localhost/calories_tracker_test');
  mongoose.connection
    .once('open', () => {
      console.log('Good to go!');
      done();
    })
    .on('error', (err) => {
      console.warn('Warning', error);
    });
});

beforeEach((done) => {
  const { meals } = mongoose.connection.collections;
  meals.drop(() => {
    done();
  })
});
