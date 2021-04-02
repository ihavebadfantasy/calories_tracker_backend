const assert = require('assert');
const Activity = require('../src/models/Activity');
const activities = require('../db/seeds/1_activities/activities');

describe('Activity', () => {
  it('activity db is seeded',(done) => {
    Activity.find({})
      .then((res) => {
        assert(res.length === activities.length);
        done();
      })
  });
})
