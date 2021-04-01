const assert = require('assert');
const Meal = require('../src/models/Meal');

describe('Meal', () => {
  let meal;

  beforeEach((done) => {
    meal = new Meal({
      nutriment: 'apple',
      weight: 100,
      calories: 41,
    });

    meal.save().then(() => done())
  })

  it('saves a meal', () => {
    assert(!meal.isNew);
  });

  it('updates a meal', (done) => {
    meal.update({ calories: 43 })
      .then(() => {
        console.log('in them');
        return Meal.findOne({ nutriment: 'apple' });
      })
      .then((res) => {
        assert(res.calories === 43);
        done();
      });
  });

  it('do softdelete on meal', (done) => {
    meal.destroy()
      .then(() => {
        return Meal.find({})
      })
      .then((meals) => {
        assert(meals[0].deleted);

        return Meal.find({deleted: false});
      })
      .then((meals) => {
        assert(!meals.length);
        done();
      })
  })
})
